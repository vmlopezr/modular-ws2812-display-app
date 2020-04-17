import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  ActivityIndicator,
  StatusBar,
  Alert,
  TouchableOpacity
} from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { screenWidth, screenHeight } from '../GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import LocalStorage from '../../LocalStorage';
import FileInput from '../../components/FileInput';

export interface ESPFiles {
  file: string;
  width: number;
  height: number;
}
const styles = StyleSheet.create({
  modalTransparentBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080'
  },
  modal: {
    zIndex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: screenHeight,
    width: screenWidth,
    backgroundColor: '#ececf1'
  },
  modalHeader: {
    height: 55,
    width: '100%',
    borderColor: '#525252',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'flex-end',
    backgroundColor: '#08386D',
    flexDirection: 'row',
    paddingBottom: 3
  },
  titleContainer: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  titleLabel: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  spacer: {
    width: '100%',
    height: 20,
    backgroundColor: 'transparent'
  },
  fileLabelContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 8
  },
  fileSizeContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8
  },
  fileItemContainer: {
    height: 50,
    width: screenWidth,
    borderColor: '#c0c0c0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileItemSpacer: {
    width: '100%',
    height: 8,
    backgroundColor: 'transparent'
  },
  modalSubHeader: {
    height: 60,
    width: '100%',
    borderColor: '#525252',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  modalBody: {
    flex: 1,
    height: screenHeight - 120,
    backgroundColor: '#ebebeb',
    width: '100%'
  },
  loading: {
    position: 'absolute',
    left: (screenWidth - 100) / 2,
    top: (screenHeight - 100) / 2,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.5)',
    zIndex: 2
  }
});
interface Props {
  closeSaveModal(): void;
  gridData(): string;
  updateFileName(data: string): void;
  showSaveModal: boolean;
  fileList: ESPFiles[];
}
interface State {
  selected: number;
  loading: boolean;
}
/*
  NOTE: This Modal can only be accessed with live connection to the ESP32.
*/
class SaveFileModal extends React.Component<Props, State> {
  prevFileName: string;
  fileName: string;
  gridData: string;
  storage: LocalStorage;
  inputRef: React.RefObject<FileInput>;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.fileName = ' ';
    this.inputRef = React.createRef();
    this.state = {
      selected: -1,
      loading: false
    };
    this.prevFileName = '';
  }
  selectFile = index => () => {
    if (index === this.state.selected) {
      this.inputRef.current.setFileName('');
      this.setState({ selected: -1 });
    } else {
      this.fileName = this.props.fileList[index].file;
      this.inputRef.current.setFileName(this.fileName);

      this.setState({ selected: index });
    }
  };
  deSelectFile = () => {
    this.setState({ selected: -1 });
  };
  getColor = (index: number): string => {
    return index === this.state.selected ? '#d3d3d3' : '#fff';
  };

  writeComplete = (event: MessageEvent) => {
    const message = event.data as string;
    if (message === 'SUXS') {
      this.setState({ loading: false });
      this.props.updateFileName(this.getFileName());
    } else if (message === 'FERR' || message === 'WERR') {
      alert(
        'Warning: Could not write file. Please try again. Verify Connections and power.'
      );
      this.setState({ loading: false });
    } else {
      alert('Warning: Data was not written correctly.');
      this.setState({ loading: false });
    }
    this.storage.socketInstance.removeEventListener(
      'message',
      this.writeComplete
    );
  };
  writeData = () => {
    this.storage.socketInstance.addEventListener('message', this.writeComplete);

    const filename = this.getFileName();
    const BUFFERSIZE = 14000;
    const fileheader =
      'save/' +
      filename +
      'w' +
      this.storage.width +
      ' h' +
      this.storage.height +
      '\n';
    const gridData = this.props.gridData();
    if (gridData.length <= BUFFERSIZE) {
      // Send all the data
      const data = fileheader + gridData + 'EX1T';
      this.storage.socketInstance.send(data);
    } else {
      // Send the first chunk of the data
      let data = fileheader + gridData.slice(0, BUFFERSIZE);
      this.storage.socketInstance.send(data);

      // Get the rest of the data
      let partialData = gridData.slice(BUFFERSIZE, gridData.length);
      while (partialData.length > 0) {
        if (partialData.length < BUFFERSIZE) {
          // Send the last chunk of data
          data = 'apnd/' + filename + partialData + 'EX1T';
          partialData = '';
        } else {
          // Send the next chunk of data
          data = 'apnd/' + filename + partialData.slice(0, BUFFERSIZE);
          partialData = partialData.slice(BUFFERSIZE, gridData.length);
        }
        this.storage.socketInstance.send(data);
      }
    }
  };
  getData = () => {
    if (this.state.selected === -1) {
      if (this.verifyFilename(this.fileName)) {
        this.setState({ loading: true });

        // Set a timeout to allow loading icon to render
        setTimeout(() => {
          this.writeData();
        }, 10);
      }
    } else {
      const file = this.props.fileList[this.state.selected].file;
      if (this.verifyFilename(this.fileName)) {
        if (this.getFileName() === file) {
          Alert.alert(
            'Warning: File already exists',
            'Attempting to save replace the file. Are you sure?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'OK',
                onPress: () => {
                  this.setState({ loading: true });
                  setTimeout(() => {
                    this.writeData();
                  }, 10);
                }
              }
            ],
            { cancelable: false }
          );
        }
      }
    }
  };
  getFileName = (): string => {
    if (!this.fileName.includes('.')) {
      return this.fileName.replace(/(\r\n|\n|\r| )/g, '') + '.txt';
    } else {
      return this.fileName.replace(/(\r\n|\n|\r| )/g, '');
    }
  };
  verifyFilename = (file: string) => {
    let correctformat;
    if (!file.includes(' ')) {
      if (!file.includes('.')) {
        correctformat = true;
      } else {
        const fileExtension = file.substr(file.indexOf('.') + 1, file.length);
        if (fileExtension.includes('.')) {
          correctformat = false;
          alert('Warning: The file name cannot have more than one period.');
        } else if (fileExtension.length === 3) {
          correctformat = true;
        } else {
          correctformat = false;
          alert('Warning: The file extension must be 3 characters.');
        }
      }
    } else {
      correctformat = false;
      alert('Warning: The file name must not have spaces.');
    }
    return correctformat;
  };
  filenameInput = (file: string): void => {
    this.fileName = file;
  };
  renderSubHeader = () => {
    return (
      <View style={styles.modalSubHeader}>
        <View
          style={{
            flex: 5,
            width: 50
          }}
        >
          <FileInput
            ref={this.inputRef}
            defaultValue="Enter Filename"
            label="Filename:"
            updateValue={this.filenameInput}
            icon="ios-document"
            iconColor="grey"
            iconSize={30}
            deSelect={this.deSelectFile}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingRight: 10
          }}
        >
          <CustomButton
            width={60}
            backgroundColor="transparent"
            label="Save"
            fontColor="#147EFB"
            onPress={this.getData}
          />
        </View>
      </View>
    );
  };
  renderHeader = () => {
    return (
      <View style={styles.modalHeader}>
        <View style={{ flex: 1, width: 50 }}></View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleLabel}>Save File</Text>
        </View>
        <View style={{ flex: 1, width: 60 }}>
          <View style={{ flex: 1 }}></View>
          <CustomButton
            width={60}
            height={20}
            backgroundColor="transparent"
            label="Exit"
            fontColor="#fff"
            fontSize={18}
            onPress={this.props.closeSaveModal}
          />
        </View>
      </View>
    );
  };
  renderFileItem = (value: ESPFiles, index: number) => {
    const backgroundColor = index === this.state.selected ? '#d3d3d3' : '#fff';
    return (
      <TouchableOpacity key={index} onPress={this.selectFile(index)}>
        <View
          style={[
            styles.fileItemContainer,
            { backgroundColor: backgroundColor }
          ]}
        >
          <View style={styles.fileLabelContainer}>
            <Text style={{ fontWeight: 'bold' }}>{value.file}</Text>
          </View>
          <View style={styles.fileSizeContainer}>
            <Text style={{ fontWeight: 'bold' }}>
              {' width: ' + value.width + ' height: ' + value.height}
            </Text>
          </View>
        </View>
        <View style={styles.fileItemSpacer}></View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.showSaveModal}
        animationType="none"
      >
        <View style={styles.modal}>
          <StatusBar barStyle="light-content" />
          {this.renderHeader()}
          {this.renderSubHeader()}
          <View style={styles.modalBody}>
            <View style={styles.fileItemSpacer}></View>
            <ScrollView>
              <View>
                {this.props.fileList.map((value, index) => {
                  return this.renderFileItem(value, index);
                })}
              </View>
              <View
                style={{ height: 40, backgroundColor: 'transparent' }}
              ></View>
            </ScrollView>
          </View>
        </View>
        {this.state.loading && (
          <View style={styles.modalBackground}>
            <View style={styles.loading}>
              <ActivityIndicator size="large" animating={this.state.loading} />
            </View>
          </View>
        )}
      </Modal>
    );
  }
}
export default SaveFileModal;

import React from 'react';
import { View, StyleSheet, Modal, Text, StatusBar } from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { screenWidth, screenHeight } from '../GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import FileItem from '../../components/FileItem';
import LocalStorage from '../../LocalStorage';
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
    zIndex: 2,
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
    paddingBottom: 3,
    backgroundColor: '#08386D',
    flexDirection: 'row'
  },
  modalBody: {
    flex: 1,
    zIndex: 2,
    height: '100%',
    backgroundColor: '#ebebeb',
    width: '100%'
  },
  titleContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleLabel: { fontSize: 20, fontWeight: 'bold', color: 'white' }
});
interface Props {
  closeOpenModal(): void;
  showFileModal: boolean;
  fileList: ESPFiles[];
}

class DefaultFileModal extends React.PureComponent<Props> {
  fileSelection: string[];
  storage: LocalStorage;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
  }
  componentDidMount() {
    this.fileSelection = [];
  }
  isFileDisplayed = (): string[] => {
    const filesDisplayed = [];
    this.fileSelection.map(filename => {
      if (this.storage.defaultFrameDisplayed.includes(filename)) {
        filesDisplayed.push(filename);
      }
    });
    return filesDisplayed;
  };
  deleteFiles = () => {
    const { socketInstance } = this.storage;
    const filesDisplayed = this.isFileDisplayed();
    if (filesDisplayed.length === 0) {
      this.fileSelection.map(value => {
        socketInstance.send('DELS/' + value);
      });
      this.fileSelection.splice(0, this.fileSelection.length);
      this.props.closeOpenModal();
    } else {
      let message = '';
      filesDisplayed.map(filename => {
        message = message + filename + '\n';
      });
      alert(
        'Please remove the following files from the default page before attempting to delete:\n\n' +
          message
      );
    }
  };
  onCloseModal = () => {
    this.fileSelection.splice(0, this.fileSelection.length);
    this.props.closeOpenModal();
  };
  fileSelected = (filename: string): void => {
    this.fileSelection.push(filename);
  };
  fileDeSelected = (filename: string): void => {
    const index = this.fileSelection.indexOf(filename);
    if (index !== -1) {
      this.fileSelection.splice(index, 1);
    }
  };
  renderHeader = () => {
    return (
      <View style={styles.modalHeader}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row-reverse'
          }}
        >
          <CustomButton
            width={60}
            height={20}
            backgroundColor="transparent"
            label="Cancel"
            fontColor="#fff"
            onPress={this.onCloseModal}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleLabel}>Delete File</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
          <CustomButton
            width={60}
            height={20}
            backgroundColor="transparent"
            label="Delete"
            fontColor="#fff"
            onPress={this.deleteFiles}
          />
        </View>
      </View>
    );
  };
  shouldDisableItem(filename: string): boolean {
    if (this.storage.defaultFrameDisplayed.includes(filename)) return true;
    return false;
  }
  render() {
    const { showFileModal } = this.props;
    return (
      <Modal transparent={true} visible={showFileModal} animationType="none">
        <View style={styles.modal}>
          <StatusBar barStyle="light-content" />
          {this.renderHeader()}
          <View style={styles.modalBody}>
            <ScrollView>
              <View>
                {this.props.fileList.map((value, index) => {
                  return (
                    <FileItem
                      key={index + 'h'}
                      data={value}
                      fileDeSelected={this.fileDeSelected}
                      fileSelected={this.fileSelected}
                      fileModal={this.props.showFileModal}
                      disabled={this.shouldDisableItem(value.file)}
                    />
                  );
                })}
              </View>
              <View
                style={{ height: 40, backgroundColor: 'transparent' }}
              ></View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}
export default DefaultFileModal;

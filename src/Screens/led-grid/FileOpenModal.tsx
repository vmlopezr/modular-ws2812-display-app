import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Alert,
  StatusBar,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { screenWidth, screenHeight } from '../GlobalStyles';
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
  titleLabel: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  spacer: {
    width: '100%',
    height: 8,
    backgroundColor: 'transparent'
  },
  fileItem: {
    height: 50,
    width: screenWidth,
    borderColor: '#c0c0c0',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileLabel: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 8
  },
  fileSizeLabel: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8
  }
});
interface Props {
  updateFileName(data: string): void;
  closeOpenModal(): void;
  showFileModal: boolean;
  fileList: ESPFiles[];
  width: number;
  height: number;
}
interface State {
  selected: number;
}
class FileOpenModal extends React.Component<Props, State> {
  prevFileName: string;
  constructor(props) {
    super(props);
    this.state = {
      selected: -1
    };
    this.prevFileName = '';
  }
  selectFile = index => () => {
    if (index === this.state.selected) {
      this.setState({ selected: -1 });
    } else {
      this.setState({ selected: index });
    }
  };
  getColor = (index: number): string => {
    return index === this.state.selected ? '#d3d3d3' : '#fff';
  };
  closeModal = () => {
    if (this.state.selected < 0) {
      this.props.updateFileName('');
    } else {
      const index = this.state.selected;
      const { width, height } = this.props.fileList[index];

      if (width === this.props.width && height === this.props.height) {
        const file = this.props.fileList[this.state.selected].file;
        if (this.prevFileName === file) {
          Alert.alert(
            'Warning: File already open',
            'Attempting to open the file again, may override unsaved work. Are you sure?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'OK',
                onPress: () => {
                  this.prevFileName = file;
                  this.props.updateFileName(file);
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          this.prevFileName = this.props.fileList[this.state.selected].file;
          this.props.updateFileName(this.prevFileName);
        }
      } else {
        alert(
          'Warning: The file size does not match the current grid. Please choose a file with the corresponding size.'
        );
      }
    }
  };
  renderHeader = () => {
    return (
      <View style={styles.modalHeader}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}></View>
          <CustomButton
            width={60}
            height={20}
            backgroundColor="transparent"
            label="Exit"
            fontColor="#fff"
            fontSize={20}
            onPress={this.props.closeOpenModal}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleLabel}>Open File</Text>
        </View>
        <View style={{ flex: 1, alignContent: 'flex-end' }}>
          <View style={{ flex: 1 }}></View>
          <CustomButton
            fontSize={20}
            width={60}
            height={20}
            backgroundColor="transparent"
            label="Done"
            fontColor="#fff"
            onPress={this.closeModal}
          />
        </View>
      </View>
    );
  };
  renderFileItem = (value: ESPFiles, index: number) => {
    const backgroundColor = index === this.state.selected ? '#d3d3d3' : '#fff';
    return (
      <TouchableOpacity key={index} onPress={this.selectFile(index)}>
        <View style={styles.spacer}></View>
        <View style={[styles.fileItem, { backgroundColor: backgroundColor }]}>
          <View style={styles.fileLabel}>
            <Text style={{ fontWeight: 'bold' }}>{value.file}</Text>
          </View>
          <View style={styles.fileSizeLabel}>
            <Text style={{ fontWeight: 'bold' }}>
              {' width: ' + value.width + ' height: ' + value.height}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { width, height, showFileModal } = this.props;
    return (
      <Modal transparent={true} visible={showFileModal} animationType="none">
        <View collapsable={false} style={styles.modal}>
          <StatusBar barStyle="light-content" />
          {this.renderHeader()}
          <View style={styles.modalBody} collapsable={false}>
            <ScrollView>
              <View collapsable={false}>
                {this.props.fileList.map((value, index) => {
                  if (value.width === width && value.height === height) {
                    return this.renderFileItem(value, index);
                  }
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
export default FileOpenModal;

import React from 'react';
import { View, StyleSheet, Modal, Text, StatusBar } from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { screenWidth, screenHeight } from '../GlobalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import FileItem from '../../components/FileItem';
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row-reverse'
  },
  titleContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
interface Props {
  displayFile(): void;
  closeOpenModal(): void;
  showFileModal: boolean;
  fileList: ESPFiles[];
  width: number;
  height: number;
  fileSelected(filename: string): void;
  fileDeSelected(filename: string): void;
  checkFiles(): boolean;
  defaultFileList: string[];
}

class DefaultFileModal extends React.PureComponent<Props> {
  prevFileName: string;
  constructor(props) {
    super(props);
    this.prevFileName = '';
  }
  closeModal = () => {
    if (!this.props.checkFiles()) {
      this.props.displayFile();
    } else {
      alert('Warning: One of the files has already been chosen.');
    }
  };
  renderHeader(): JSX.Element {
    return (
      <View style={styles.modalHeader}>
        <View style={styles.buttonContainer}>
          <CustomButton
            width={60}
            height={20}
            backgroundColor="transparent"
            label="Cancel"
            fontColor="#fff"
            onPress={this.props.closeOpenModal}
          />
        </View>
        <View collapsable={false} style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
            Open File
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
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
  }
  shouldDisableItem(filename: string): boolean {
    if (this.props.defaultFileList.includes(filename)) return true;
    return false;
  }
  render() {
    const { width, height, showFileModal } = this.props;
    // console.log('file modal');
    // console.log(this.props.defaultFileList);
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
                    return (
                      <FileItem
                        key={index + 'f'}
                        data={value}
                        fileDeSelected={this.props.fileDeSelected}
                        fileSelected={this.props.fileSelected}
                        fileModal={showFileModal}
                        disabled={this.shouldDisableItem(value.file)}
                      />
                    );
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
export default DefaultFileModal;

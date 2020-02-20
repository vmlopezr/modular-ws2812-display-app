import React from 'react';
import { View, StyleSheet, Modal, Text, Alert, StatusBar } from 'react-native';
import { CustomButton } from './CustomButton';
import { screenWidth, screenHeight } from '../Screens/GlobalStyles';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
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
  }
});
interface Props {
  updateFileName(data: string): void;
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
      if (
        this.props.fileList[index].width === this.props.width &&
        this.props.fileList[index].height === this.props.height
      ) {
        if (
          this.prevFileName === this.props.fileList[this.state.selected].file
        ) {
          Alert.alert(
            'Warning: File already open',
            'Attempting to open the file again, may override unsaved work. Are you sure?',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'OK',
                onPress: () => {
                  this.prevFileName = this.props.fileList[
                    this.state.selected
                  ].file;
                  this.props.updateFileName(
                    this.props.fileList[this.state.selected].file
                  );
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          this.prevFileName = this.props.fileList[this.state.selected].file;
          this.props.updateFileName(
            this.props.fileList[this.state.selected].file
          );
        }
      } else {
        alert(
          'Warning: The file size does not match the current grid. Please choose a file with the corresponding size.'
        );
      }
    }
  };

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.showFileModal}
        animationType="none"
      >
        <View collapsable={false} style={styles.modal}>
          <StatusBar barStyle="light-content" />
          <View style={styles.modalHeader}>
            <View
              collapsable={false}
              style={{
                flex: 1,
                width: 50
              }}
            ></View>
            <View
              collapsable={false}
              style={{
                flex: 3,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
              >
                Open File
              </Text>
            </View>
            <View
              collapsable={false}
              style={{ flex: 1, alignItems: 'flex-end' }}
            >
              <View collapsable={false} style={{ flex: 1 }}></View>
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
          <View style={styles.modalBody} collapsable={false}>
            <ScrollView>
              <View collapsable={false}>
                {this.props.fileList.map((value, index) => {
                  return (
                    <View key={index}>
                      <View
                        collapsable={false}
                        style={{
                          width: '100%',
                          height: 8,
                          backgroundColor: 'transparent'
                        }}
                      ></View>
                      {/* <TouchableOpacity */}
                      <View
                        style={{
                          height: 50,
                          width: screenWidth,
                          backgroundColor:
                            index === this.state.selected ? '#d3d3d3' : '#fff',
                          borderColor: '#c0c0c0',
                          borderBottomWidth: 1,
                          borderTopWidth: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        // onPress={this.selectFile(index)}
                        onTouchEnd={this.selectFile(index)}
                      >
                        <View
                          collapsable={false}
                          style={{
                            flex: 1,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingLeft: 8
                          }}
                        >
                          <Text style={{ fontWeight: 'bold' }}>
                            {value.file}
                          </Text>
                        </View>
                        <View
                          collapsable={false}
                          style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingRight: 8
                          }}
                        >
                          <Text style={{ fontWeight: 'bold' }}>
                            {' width: ' +
                              value.width +
                              ' height: ' +
                              value.height}
                          </Text>
                        </View>
                      </View>
                      {/* </TouchableOpacity> */}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}
export default FileOpenModal;

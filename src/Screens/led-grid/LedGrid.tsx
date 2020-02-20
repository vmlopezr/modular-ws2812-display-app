/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents,
  SafeAreaView
} from 'react-navigation';
import ColorPicker from '../../components/ColorPicker';
import styles from './LedGrid.style';
import LocalStorage from '../../LocalStorage';
import GlobalStyles, { screenWidth } from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import { CustomButton } from '../../components/CustomButton';
import FileOpenModal from '../../components/FileOpenModal';
import SaveFileModal from '../../components/SaveFileModal';
import GridComponent from './GridComponent';
import { ESPFiles } from '../../components/FileOpenModal';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  width: number;
  height: number;
  NodeColor: string;
  loading: boolean;
  showFileModal: boolean;
  showSaveModal: boolean;
  fileList: ESPFiles[];
  openedFileName: string;
  // openFile: string;
}
class LedGrid extends React.PureComponent<Props, State> {
  storage: LocalStorage;
  _scrollParentRef: any;
  colorRef: React.RefObject<ColorPicker>;
  fileRef: React.RefObject<FileOpenModal>;
  saveRef: React.RefObject<SaveFileModal>;
  GridRef: React.RefObject<GridComponent>;
  width: number;
  height: number;
  loading: boolean;
  fileName: string;
  dataRead: string;
  dummyData: string;
  fileNames: ESPFiles[];
  saveFile: boolean;
  openFile: boolean;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.state = {
      width: this.storage.width,
      height: this.storage.height,
      loading: false,
      showSaveModal: false,
      showFileModal: false,
      NodeColor: '#646464',
      fileList: [],
      openedFileName: ''
    };
    this.width = this.storage.width;
    this.height = this.storage.height;
    this._scrollParentRef = React.createRef();
    this.colorRef = React.createRef();
    this.fileRef = React.createRef();
    this.saveRef = React.createRef();
    this.GridRef = React.createRef();
    this.fileName = '';
  }

  removeNewLine(str: string) {
    return str.replace(/(\r\n|\n|\r| )/g, '');
  }

  clearScreen = () => {
    this.GridRef.current.clearScreen();
  };
  onColorChange = (color: string) => {
    // console.log('setting color');
    this.setState({ NodeColor: color });
  };
  onEnter = () => {
    this.storage.focusedScreen = 'LedGrid';
    if (
      this.state.width !== this.storage.width ||
      this.state.height !== this.storage.height
    ) {
      this.setState({
        width: this.storage.width,
        height: this.storage.height,
        loading: true,
        openedFileName: ''
      });
    } else {
      this.setState({
        showFileModal: false,
        showSaveModal: false,
        openedFileName: ''
      });
    }

    this.fileName = '';
    this.clearScreen();
    if (this.storage.ESPConn) {
      this.setESPLiveInputState();
    }
  };
  setESPLiveInputState = () => {
    this.storage.socketInstance.send('LIVE');
  };
  onExit = () => {
    if (this.storage.ESPConn) {
      this.storage.socketInstance.send('STLI');
    }
  };
  requestFileNames = (modal: string) => () => {
    if (this.storage.ESPConn) {
      this.setState({ loading: true });
      this.saveFile = modal === 'save' ? true : false;
      this.openFile = modal === 'open' ? true : false;

      this.storage.socketInstance.addEventListener(
        'message',
        this.obtainFileNames
      );
      this.storage.socketInstance.send('dirs');
    } else {
      alert(
        'Warning: You are not connected to the ESP32. Verify power and connection before opening/saving data.'
      );
    }
  };
  obtainFileNames = (event: MessageEvent) => {
    const data = event.data as string;

    this.storage.socketInstance.removeEventListener(
      'message',
      this.obtainFileNames
    );
    this.setState({
      loading: false,
      showFileModal: this.openFile,
      showSaveModal: this.saveFile,
      fileList: this.processData(data.replace(/\//g, ''))
    });
  };
  processData = (data: string) => {
    const datalist = [];
    const files = data;
    const list = files.split(',');
    if (list.length % 2 === 0) {
      for (let i = 0; i < list.length / 2; i++) {
        const size = this.getSize(list[2 * i + 1]);
        datalist.push({
          file: list[2 * i],
          width: size.width,
          height: size.height
        });
      }
      return datalist;
    } else {
      return [];
    }
  };
  getSize = (data: string) => {
    const values = data.split(' ');
    return {
      width: parseInt(values[0].substr(1, values[0].length - 1)),
      height: parseInt(values[1].substr(1, values[1].length - 1))
    };
  };
  updateWidth = (width: number) => {
    this.width = width;
  };
  updateHeight = (height: number) => {
    this.height = height;
  };
  updateLoading = (loading: boolean) => {
    this.setState({ loading: loading });
  };
  openColorPicker = () => {
    this.colorRef.current.showModal();
  };

  closeSaveModal = () => {
    this.setState({ showSaveModal: false });
  };
  updateFileName = (filename: string) => {
    if (filename.length > 0) {
      this.fileName = filename;

      this.setState({
        loading: true,
        showFileModal: false,
        openedFileName: filename
      });
      this.startLoadingOnRead();
    } else {
      this.fileName = filename;
      this.setState({
        showFileModal: false,
        openedFileName: filename
      });
    }
  };
  getSavedFileName = (filename: string) => {
    this.fileName = filename;
    this.setState({ showSaveModal: false, openedFileName: filename });
  };
  startLoadingOnRead = () => {
    this.startReadingProcess();
  };
  startReadingProcess = async () => {
    this.dataRead = '';
    this.storage.socketInstance.addEventListener('message', this.receiveData);
    const message = 'read/' + this.fileName;
    // const message = 'read/' + this.state.openedFileName;
    this.storage.socketInstance.send(message);
  };

  receiveData = (event: { data: string }) => {
    if (event.data === 'EX1T') {
      this.storage.socketInstance.removeEventListener(
        'message',
        this.receiveData
      );
      this.GridRef.current.processFileData(this.removeNewLine(this.dataRead));
    } else {
      const data = event.data;
      this.dataRead = this.dataRead + data;
    }
  };
  gridData = (): string => {
    return this.GridRef.current.sendGridData();
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <NavigationEvents onDidFocus={this.onEnter} onWillBlur={this.onExit} />
        <AppHeader title="Billboard Draw" navigation={this.props.navigation} />
        <View style={styles.body} collapsable={false}>
          <View
            collapsable={false}
            style={{
              backgroundColor: 'white',
              borderBottomWidth: 1,
              borderColor: '#202020',
              width: screenWidth,
              height: screenWidth - 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <GridComponent
              ref={this.GridRef}
              updateLoading={this.updateLoading}
              width={this.state.width}
              height={this.state.height}
              NodeColor={this.state.NodeColor}
            />
          </View>
          <View style={styles.filenameDisplay}>
            <Text style={{ fontSize: 15, paddingLeft: 8 }}>
              {'Filename: ' + this.state.openedFileName}
            </Text>
          </View>
          <ScrollView ref={this._scrollParentRef}>
            <View
              collapsable={false}
              style={{
                alignItems: 'center',
                width: screenWidth,
                minHeight: 200,
                backgroundColor: '#ebebeb'
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: 20,
                  backgroundColor: 'transparent'
                }}
              ></View>

              <CustomButton
                backgroundColor="#fff"
                borderColor="#d3d3d3"
                fontColor="#147EFB"
                label={'Pick LED Color'}
                width={screenWidth}
                onPress={this.openColorPicker}
              />
              <View
                style={{
                  width: '100%',
                  height: 20,
                  backgroundColor: 'transparent'
                }}
              ></View>
              <CustomButton
                backgroundColor="#fff"
                borderColor="#d3d3d3"
                fontColor="#147EFB"
                label={'Clear Billboard'}
                width={screenWidth}
                onPress={this.clearScreen}
              />

              <View
                style={{
                  width: '100%',
                  height: 20,
                  backgroundColor: 'transparent'
                }}
              ></View>

              <CustomButton
                backgroundColor="#fff"
                borderColor="#d3d3d3"
                fontColor="#147EFB"
                label={'Open File'}
                width={screenWidth}
                onPress={this.requestFileNames('open')}
              />

              <View
                style={{
                  width: '100%',
                  height: 20,
                  backgroundColor: 'transparent'
                }}
              ></View>

              <CustomButton
                backgroundColor="#fff"
                borderColor="#d3d3d3"
                fontColor="#147EFB"
                label={'Save File'}
                width={screenWidth}
                onPress={this.requestFileNames('save')}
              />
              <FileOpenModal
                ref={this.fileRef}
                updateFileName={this.updateFileName}
                showFileModal={this.state.showFileModal}
                width={this.state.width}
                height={this.state.height}
                fileList={this.state.fileList}
              />
              <SaveFileModal
                ref={this.saveRef}
                updateFileName={this.getSavedFileName}
                showSaveModal={this.state.showSaveModal}
                closeSaveModal={this.closeSaveModal}
                fileList={this.state.fileList}
                gridData={this.gridData}
              />
              <ColorPicker
                ref={this.colorRef}
                onColorChange={this.onColorChange}
                clearScreen={this.clearScreen}
                initialState={{ R: 100, G: 100, B: 100 }}
              />
            </View>
          </ScrollView>
        </View>
        {this.state.loading && (
          <View style={styles.modalBackground}>
            <View style={styles.loading}>
              <ActivityIndicator size="large" animating={this.state.loading} />
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
export default LedGrid;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents,
  SafeAreaView
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import ColorPicker from '../../components/ColorPicker';
import styles from './LedGrid.style';
import LocalStorage from '../../LocalStorage';
import GlobalStyles, { screenWidth } from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import { CustomButton } from '../../components/CustomButton';
import FileOpenModal from './FileOpenModal';
import SaveFileModal from './SaveFileModal';
import DeleteFileModal from './DeleteFileModal';
import GridComponent from './GridComponent';
import { ESPFiles } from './FileOpenModal';

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  width: number;
  height: number;
  NodeColor: string;
  LedColor: string;
  loading: boolean;
  showFileModal: boolean;
  showSaveModal: boolean;
  showDeleteFileModal: boolean;
  fileList: ESPFiles[];
  openedFileName: string;
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
  deleteFiles: boolean;
  loadingTimeout: any;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.state = {
      width: this.storage.width,
      height: this.storage.height,
      loading: false,
      showSaveModal: false,
      showFileModal: false,
      showDeleteFileModal: false,
      NodeColor: '#646464',
      LedColor: '#000000',
      fileList: [],
      openedFileName: ''
    };
    this.width = this.storage.width;
    this.height = this.storage.height;
    this._scrollParentRef = React.createRef();
    this.colorRef = React.createRef();
    this.GridRef = React.createRef();
    this.fileName = '';
    this.loadingTimeout = null;
  }
  componentDidMount() {
    if (this.storage.ESPConn) {
      this.setESPLiveInputState();
    }
  }
  removeNewLine(str: string) {
    return str.replace(/(\r\n|\n|\r| )/g, '');
  }

  clearScreen = () => {
    this.GridRef.current.clearScreen();
  };
  onColorChange = (Nodecolor: string, LedColor: string) => {
    this.setState({ NodeColor: Nodecolor, LedColor: LedColor });
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
        showDeleteFileModal: false,
        openedFileName: ''
      });
    }

    this.fileName = '';
    this.clearScreen();
    setTimeout(() => {
      if (this.storage.ESPConn) {
        this.setESPLiveInputState();
      }
    }, 200);
  };
  setESPLiveInputState = () => {
    if (this.storage.ESPConn) this.storage.socketInstance.send('LIVE');
  };
  onExit = () => {
    if (this.storage.ESPConn) this.storage.socketInstance.send('EXLI');
  };
  requestFileNames = (selectedModal: string) => () => {
    if (this.storage.ESPConn) {
      this.setState({ loading: true });

      // Set timeout to guard against unexpected connection loss during
      // filesystem retrieval.
      this.loadingTimeout = setTimeout(() => {
        alert(
          'An error occurred while attempting to open the modal. Verify the ESP32 Connection.'
        );
        // Stop loading icon, and reset page
        this.setState({
          loading: false,
          showFileModal: false,
          showDeleteFileModal: false,
          showSaveModal: false
        });
      }, 15000);

      // Set the modal that will load
      this.saveFile = selectedModal === 'save' ? true : false;
      this.openFile = selectedModal === 'open' ? true : false;
      this.deleteFiles = selectedModal === 'delete' ? true : false;

      // Make websocket call, and retrieve the filesystem in the SD from the ESP32
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
      showDeleteFileModal: this.deleteFiles,
      fileList: this.processData(data.replace(/\//g, ''))
    });
    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = null;
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
  closeFileOpenModal = () => {
    this.setState({ showFileModal: false });
  };
  closeDeleteFileModal = () => {
    this.setState({ showDeleteFileModal: false });
  };
  updateFileName = (filename: string) => {
    if (filename.length > 0) {
      this.fileName = filename;

      this.setState({
        loading: true,
        showFileModal: false,
        openedFileName: filename
      });
      this.startReadingProcess();
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
  startReadingProcess = async () => {
    this.dataRead = '';
    this.storage.socketInstance.addEventListener('message', this.receiveData);
    const message = 'read/' + this.fileName;
    if (this.storage.ESPConn) this.storage.socketInstance.send(message);
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
  renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={this.requestFileNames('save')}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: screenWidth / 3,
            height: 55,
            backgroundColor: 'white',
            borderColor: '#d1d1d1',
            borderRightWidth: 1,
            borderTopWidth: 1
          }}
        >
          <Ionicons name={'ios-save'} size={30} color={'tomato'} />
          <Text style={{ fontWeight: 'bold', color: 'tomato' }}>{'Save'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={this.requestFileNames('open')}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: screenWidth / 3,
            height: 55,
            backgroundColor: 'white',
            borderColor: '#d1d1d1',
            borderRightWidth: 1,
            borderTopWidth: 1
          }}
        >
          <Ionicons name={'ios-open'} size={30} color={'tomato'} />
          <Text style={{ fontWeight: 'bold', color: 'tomato' }}>{'Open'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={this.requestFileNames('delete')}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: screenWidth / 3,
            height: 55,
            backgroundColor: 'white',
            borderColor: '#d1d1d1',
            borderTopWidth: 1
          }}
        >
          <Ionicons name={'ios-trash'} size={30} color={'tomato'} />
          <Text style={{ fontWeight: 'bold', color: 'tomato' }}>
            {'Delete'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  gridData = (): string => {
    return this.GridRef.current.sendGridData();
  };
  renderGrid = () => {
    return (
      <View
        collapsable={false}
        style={{
          backgroundColor: '#ebebeb',
          borderBottomWidth: 1,
          borderColor: '#202020',
          width: screenWidth,
          height: screenWidth,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View pointerEvents="box-none">
          <GridComponent
            ref={this.GridRef}
            updateLoading={this.updateLoading}
            width={this.state.width}
            height={this.state.height}
            NodeColor={this.state.NodeColor}
            LedColor={this.state.LedColor}
          />
        </View>
      </View>
    );
  };
  renderFilename = () => {
    return (
      <View style={styles.filenameDisplay}>
        <Text style={{ fontSize: 15, paddingLeft: 8, fontWeight: 'bold' }}>
          {'Filename: ' + this.state.openedFileName}
        </Text>
      </View>
    );
  };
  renderBody = () => {
    const textColor = this.state.NodeColor === '#000000' ? '#fff' : '#000';
    return (
      <View
        collapsable={false}
        style={{
          alignItems: 'center',
          width: screenWidth,
          height: 150,
          backgroundColor: '#ebebeb'
        }}
      >
        <View
          style={{
            height: 85,
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'row'
          }}
        >
          <View
            style={{
              height: 85,
              width: 'auto',
              flex: 1,
              backgroundColor: this.state.NodeColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#b2b2b2'
            }}
          >
            <Text style={{ fontWeight: 'bold', color: textColor }}>
              {'Current Color'}
            </Text>
          </View>
          <CustomButton
            icon={'ios-color-palette'}
            iconSize={30}
            rightPadding={8}
            iconColor={'#147EFB'}
            backgroundColor="#fff"
            borderColor="transparent"
            fontColor="#147EFB"
            label={'Pick LED Color'}
            height={85}
            onPress={this.openColorPicker}
          />
        </View>
        <View style={{ height: 45 }}>
          <CustomButton
            backgroundColor="#fff"
            borderColor="#d3d3d3"
            fontColor="#147EFB"
            label={'Clear Billboard'}
            width={screenWidth}
            height={45}
            onPress={this.clearScreen}
          />
        </View>
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <NavigationEvents onDidFocus={this.onEnter} onWillBlur={this.onExit} />
        <AppHeader title="Billboard Draw" navigation={this.props.navigation} />
        <View style={styles.body} collapsable={false} pointerEvents="box-none">
          <View>{this.renderGrid()}</View>
          {this.renderFilename()}
          {this.renderBody()}
          {this.renderFooter()}
        </View>
        <ColorPicker
          ref={this.colorRef}
          onColorChange={this.onColorChange}
          clearScreen={this.clearScreen}
          initialState={{ R: 100, G: 100, B: 100 }}
        />
        {/* The components below are only rendered based on flags */}
        <FileOpenModal
          updateFileName={this.updateFileName}
          showFileModal={this.state.showFileModal}
          width={this.state.width}
          height={this.state.height}
          fileList={this.state.fileList}
          closeOpenModal={this.closeFileOpenModal}
        />
        <SaveFileModal
          updateFileName={this.getSavedFileName}
          showSaveModal={this.state.showSaveModal}
          closeSaveModal={this.closeSaveModal}
          fileList={this.state.fileList}
          gridData={this.gridData}
        />
        <DeleteFileModal
          closeOpenModal={this.closeDeleteFileModal}
          showFileModal={this.state.showDeleteFileModal}
          fileList={this.state.fileList}
        />

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

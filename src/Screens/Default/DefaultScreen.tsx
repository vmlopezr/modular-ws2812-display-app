import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Keyboard,
  Platform,
  Alert
} from 'react-native';
import styles from './DefaultScreen.style';
import { CustomButton } from '../../components/CustomButton';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
  NavigationEvents
} from 'react-navigation';
import GlobalStyles, { screenHeight } from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import LocalStorage from '../../LocalStorage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import FrameItem from './FrameItem';
import DefaultFileModal, { ESPFiles } from './DefaultFileModal';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  list: string[];
  selectButton: boolean;
  loading: boolean;
  showFileModal: boolean;
  ESPFileList: ESPFiles[];
  keyboardSpace: number;
}
interface FrameEffects {
  FileName: string;
  Effect: string;
  displayTime: string;
  Direction: string;
  SlideSpeed: string;
  BlinkTime: string;
  image: string;
}
// TODO: Replace the object list in state. Use this.state.size to rerender the list
// The draggable list will render this.array, instead of this.state.list
class DefaultScreen extends React.PureComponent<Props, State> {
  storage: LocalStorage;
  _scrollRef: React.RefObject<DraggableFlatList<string>>;
  itemSelected: number;
  effectData: FrameEffects[];
  selectedItems: string[];
  fileName: string[];
  fileindex: number;
  dataRead: string;
  onEnterRead: boolean;
  frameData: string;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this._scrollRef = React.createRef();
    this.selectedItems = [];
    this.dataRead = '';
    this.effectData = [];
    this.fileName = [];
    this.fileindex = 0;
    this.frameData = '';
    this.onEnterRead = false;
    this.state = {
      list: [],
      selectButton: false,
      loading: false,
      showFileModal: false,
      ESPFileList: [],
      keyboardSpace: screenHeight * 0.6
    };
    if (Platform.OS === 'android') {
      Keyboard.addListener('keyboardDidHide', this.keyboardHide);
      Keyboard.addListener('keyboardDidShow', this.keyboardShow);
    } else {
      Keyboard.addListener('keyboardWillHide', this.keyboardHide);
      Keyboard.addListener('keyboardWillShow', this.keyboardShow);
    }
  }
  keyboardShow = event => {
    const top = event.endCoordinates.height;
    this.updateModalPosition(screenHeight * 0.6 - top);
  };
  keyboardHide = () => {
    this.updateModalPosition(screenHeight * 0.6);
  };
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      Keyboard.removeAllListeners('keyboardDidHide');
      Keyboard.removeAllListeners('keyboardDidShow');
    } else {
      Keyboard.removeAllListeners('keyboardWillHide');
      Keyboard.removeAllListeners('keyboardWillShow');
    }
  }
  updateModalPosition = (styleTop: number) => {
    this.setState({ keyboardSpace: styleTop });
  };
  onEnter = () => {
    this.storage.focusedScreen = 'Default';
    this.storage.socketInstance.send('EDEF');
    this.retrieveDefaultData();
  };
  onExit = () => {
    this.effectData.splice(0, this.effectData.length);
    this.setState({ list: [] });
  };
  addItem = (filename: string, image: string) => {
    this._scrollRef.current.flatlistRef.current.getNode().scrollToEnd();
    setTimeout(() => {
      this.effectData.push({
        FileName: filename,
        Effect: 'None',
        displayTime: '100',
        Direction: 'Right',
        SlideSpeed: '100',
        BlinkTime: '1',
        image: image
      });
      const array = this.state.list;
      array.push(filename);
      this.setState({ list: [...array], loading: false });
      setTimeout(() => {
        this._scrollRef.current.flatlistRef.current.getNode().scrollToEnd();
      }, 100);
    }, 100);
  };
  saveFrameImage = (filename: string, image: string) => {
    this._scrollRef.current.flatlistRef.current.getNode().scrollToEnd();
    setTimeout(() => {
      const index = this.findItemIndex(this.effectData, filename);
      if (index !== -1) {
        this.effectData[index].image = image;
        const array = this.state.list;
        array.push(filename);
        this.setState({ list: [...array], loading: false });
      } else {
        this.setState({ loading: false });
      }

      setTimeout(() => {
        this._scrollRef.current.flatlistRef.current.getNode().scrollToEnd();
      }, 100);
    }, 100);
  };
  onSelect = () => {
    this.setState({ selectButton: true });
  };
  itemIsSelected = (value: string) => {
    this.selectedItems.push(value);
  };
  itemDeSelected = (value: string) => {
    const itemindex = this.selectedItems.indexOf(value);
    this.selectedItems.splice(itemindex, 1);
  };
  onCancel = () => {
    this.selectedItems.splice(0, this.selectedItems.length);
    this.setState({ selectButton: false });
  };
  findItemIndex = (list: FrameEffects[], value: string) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].FileName === value) {
        return i;
      }
    }
    return -1;
  };
  updateEffectProperty = (
    filename: string,
    property: string,
    value: string
  ) => {
    const index = this.findItemIndex(this.effectData, filename);
    this.effectData[index][property] = value;
  };
  onSave = () => {
    const length = this.state.list.length;
    if (length) {
      // need to send the size
      let data = 'SDEF' + length + '\n';
      data = data + this.storage.height + '\n';
      data = data + this.storage.width + '\n';
      this.state.list.map(value => {
        const index = this.findItemIndex(this.effectData, value);
        const frameInfo = this.effectData[index];
        data =
          data +
          '/' +
          frameInfo.FileName +
          '\n' +
          frameInfo.Effect +
          '\n' +
          frameInfo.displayTime +
          '\n' +
          frameInfo.Direction +
          '\n' +
          frameInfo.SlideSpeed +
          '\n' +
          frameInfo.BlinkTime +
          '\n';
      });

      this.storage.socketInstance.send(data);
    } else {
      this.storage.socketInstance.send('SDEF0\n');
    }
  };
  retrieveDefaultData = () => {
    this.setState({
      loading: true,
      showFileModal: false
    });
    this.getStoredFrames();
  };
  getStoredFrames = () => {
    this.storage.socketInstance.send('GDEF');
    this.storage.socketInstance.addEventListener('message', this.receiveFrames);
  };
  receiveFrames = (event: MessageEvent) => {
    if (event.data !== 'EX1T') {
      const data = event.data as string;
      this.frameData = data;
    } else {
      this.storage.socketInstance.removeEventListener(
        'message',
        this.receiveFrames
      );
      this.extractFrameData(this.frameData);
    }
  };
  extractFrameData = (data: string) => {
    const frameData = data.split('\n');
    const sizes = frameData[0].split(',');
    if (
      sizes[0] === this.storage.width.toString() &&
      sizes[1] === this.storage.height.toString()
    ) {
      this.processESPData(frameData);
    } else {
      Alert.alert(
        'Warning: The App Matrix size and stored controller size do not match.',
        'The display size stored is:\n\n        width: ' +
          sizes[0] +
          ' height: ' +
          sizes[1] +
          '. \n\nEntering will overwrite the default frame sequence. Are you sure?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              this.setState({ loading: false });
              this.props.navigation.closeDrawer();
              this.props.navigation.navigate('Settings');
            }
          },
          {
            text: 'OK',
            onPress: () => {
              this.effectData.splice(0, this.effectData.length);
              this.setState({ loading: false, list: [] });
            }
          }
        ],
        { cancelable: false }
      );
    }
  };
  processESPData = (frameData: string[]) => {
    const frameNum = frameData.length;
    this.fileName.splice(0, this.fileName.length);
    if (frameData.length - 1 > 0) {
      for (let i = 1; i < frameNum; i++) {
        if (frameData[i].length) {
          const fileData = frameData[i].split(',');
          const filename = fileData[0].slice(1);
          this.fileName.push(filename);
          this.effectData.push({
            FileName: filename,
            Effect: fileData[1],
            displayTime: fileData[2],
            Direction: fileData[3],
            SlideSpeed: fileData[4],
            BlinkTime: fileData[5],
            image: ''
          });
        }
      }
      this.fileName.map(filename => {
        this.onEnterRead = true;
        this.onEnterProcess('/' + filename);
      });
      this.setState({ loading: false });
    } else {
      // Reset the arrays
      this.effectData.splice(0, this.effectData.length);
      this.setState({ loading: false, list: [] });
    }
  };
  onEnterProcess = (filename: string) => {
    this.dataRead = '';
    this.storage.socketInstance.addEventListener(
      'message',
      this.onEnterReceive
    );
    const message = 'DFRD' + filename;
    this.storage.socketInstance.send(message);
  };
  onEnterReceive = (event: { data: string }) => {
    if (event.data === 'EX1T') {
      this.saveFrameImage(this.fileName[0], this.removeNewLine(this.dataRead));
      this.fileName.shift();
      this.dataRead = '';
      if (!this.fileName.length) {
        this.storage.socketInstance.removeEventListener(
          'message',
          this.onEnterReceive
        );
      }
    } else {
      const data = event.data;
      this.dataRead = this.dataRead + data;
    }
  };
  onDelete = () => {
    const stateCopy = this.state.list;
    this.selectedItems.map(value => {
      const itemIndex = this.findItemIndex(this.effectData, value);
      this.effectData.splice(itemIndex, 1);
      stateCopy.splice(stateCopy.indexOf(value), 1);
    });
    this.setState({ list: [...stateCopy], selectButton: false });
    this.selectedItems.splice(0, this.selectedItems.length);
  };

  onDragEnd = ({ data }) => {
    this.setState({ list: [...data] });
  };
  openFileModal = () => {
    this.setState({ showFileModal: true });
  };
  getSize = (data: string) => {
    const values = data.split(' ');
    return {
      width: parseInt(values[0].substr(1, values[0].length - 1)),
      height: parseInt(values[1].substr(1, values[1].length - 1))
    };
  };
  processFileNames = (data: string) => {
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
  requestFileNames = () => {
    this.setState({ loading: true });

    this.storage.socketInstance.addEventListener(
      'message',
      this.obtainFileNames
    );
    this.storage.socketInstance.send('dirs');
  };
  obtainFileNames = (event: MessageEvent) => {
    const data = event.data as string;

    this.storage.socketInstance.removeEventListener(
      'message',
      this.obtainFileNames
    );
    this.setState({
      loading: false,
      showFileModal: true,
      ESPFileList: this.processFileNames(data.replace(/\//g, ''))
    });
  };
  displayFile = () => {
    if (this.fileName.length) {
      this.setState({
        loading: true,
        showFileModal: false
      });
      this.fileName.map(file => {
        this.startReadingProcess('/' + file);
      });
    }
  };
  checkFiles = (): boolean => {
    const length = this.fileName.length;
    for (let i = 0; i < length; i++) {
      if (this.state.list.includes(this.fileName[i])) {
        return true;
      }
    }
    return false;
  };
  fileSelected = (value: string) => {
    this.fileName.push(value);
  };
  fileDeSelected = (value: string) => {
    const itemindex = this.fileName.indexOf(value);
    this.fileName.splice(itemindex, 1);
  };
  closeFileOpenModal = () => {
    this.setState({ showFileModal: false });
    this.fileName.splice(0, this.fileName.length);
  };
  removeNewLine(str: string) {
    return str.replace(/(\r\n|\n|\r| )/g, '');
  }
  receiveData = (event: { data: string }) => {
    if (event.data === 'EX1T') {
      this.addItem(this.fileName[0], this.removeNewLine(this.dataRead));
      this.fileName.shift();
      this.dataRead = '';
      if (!this.fileName.length) {
        this.storage.socketInstance.removeEventListener(
          'message',
          this.receiveData
        );
      }
    } else {
      const data = event.data;
      this.dataRead = this.dataRead + data;
    }
  };
  startReadingProcess = (filename: string) => {
    this.dataRead = '';
    this.storage.socketInstance.addEventListener('message', this.receiveData);
    const message = 'DFRD' + filename;
    this.storage.socketInstance.send(message);
  };

  renderItem = ({ item, drag, isActive }) => {
    const backgroundColor = '#fbfbfb';
    const index = this.findItemIndex(this.effectData, item);
    const displayWidth = this.storage.width;
    const displayHeight = this.storage.height;
    return (
      <FrameItem
        selectedButton={this.state.selectButton}
        isActive={isActive}
        itemSelected={this.itemIsSelected}
        itemDeSelected={this.itemDeSelected}
        drag={drag}
        label={item}
        backgroundColor={isActive ? '#dbdbdb' : backgroundColor}
        updateEffectProperty={this.updateEffectProperty}
        borderColor={'#d1d1d1'}
        displayWidth={displayWidth}
        displayHeight={displayHeight}
        data={this.effectData[index]}
        keyboardSpace={this.state.keyboardSpace}
      />
    );
  };
  renderSubHeader = () => (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {this.state.selectButton && (
          <CustomButton
            onPress={this.onCancel}
            label={'Cancel'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        )}
        {!this.state.selectButton && (
          <CustomButton
            onPress={this.requestFileNames}
            label={'Add'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        )}
      </View>
      <View style={{ flex: 3 }}></View>
      <View style={{ flex: 1 }}>
        {!this.state.selectButton && (
          <CustomButton
            onPress={this.onSelect}
            label={'Select'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        )}
        {this.state.selectButton && (
          <CustomButton
            onPress={this.onDelete}
            label={'Delete'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        )}
      </View>
    </View>
  );
  renderFooter = () => (
    <View style={styles.footer}>
      {!this.state.selectButton && (
        <CustomButton
          onPress={this.onSave}
          label={'Save to Controller'}
          fontColor="#147EFB"
          backgroundColor="transparent"
        />
      )}
      {this.state.selectButton && (
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#4f4f4f' }}>
          {'Select Frames'}
        </Text>
      )}
    </View>
  );
  keyExtractor = (item, index: number) => index.toString();
  render() {
    const displayWidth = this.storage.width;
    const displayHeight = this.storage.height;
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <NavigationEvents onWillFocus={this.onEnter} onWillBlur={this.onExit} />
        <AppHeader title="Set Display" navigation={this.props.navigation} />
        {this.renderSubHeader()}
        <View style={styles.body}>
          <DraggableFlatList
            data={this.state.list}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onDragEnd={this.onDragEnd}
            extraData={[
              this.state.selectButton,
              this.state.keyboardSpace,
              this.effectData
            ]}
            ref={this._scrollRef}
          />
        </View>
        {this.renderFooter()}
        {this.state.loading && (
          <View style={styles.modalBackground}>
            <View style={styles.loading}>
              <ActivityIndicator size="large" animating={this.state.loading} />
            </View>
          </View>
        )}
        <DefaultFileModal
          displayFile={this.displayFile}
          showFileModal={this.state.showFileModal}
          width={displayWidth}
          height={displayHeight}
          fileList={this.state.ESPFileList}
          closeOpenModal={this.closeFileOpenModal}
          fileSelected={this.fileSelected}
          fileDeSelected={this.fileDeSelected}
          checkFiles={this.checkFiles}
        />
      </SafeAreaView>
    );
  }
}
export default DefaultScreen;

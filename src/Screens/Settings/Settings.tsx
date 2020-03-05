import React from 'react';
import { View } from 'react-native';
import LocalStorage from '../../LocalStorage';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents,
  SafeAreaView
} from 'react-navigation';
import styles, { MatrixType } from './Settings.style';
import NumberInput from '../../components/NumberInput';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomButton } from '../../components/CustomButton';
import CommContextUpdater from '../../components/CommContextUpdater';
import GlobalStyles from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import ValueDropDown from '../../components/ValueDropDown';
interface Prop {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  width: number;
  height: number;
}
export default class SettingsScreen extends React.PureComponent<Prop, State> {
  storage: LocalStorage;
  contextRef: React.RefObject<CommContextUpdater>;
  widthRef: React.RefObject<NumberInput>;
  heightRef: React.RefObject<NumberInput>;
  width: number;
  height: number;
  Width: string;

  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.widthRef = React.createRef();
    this.heightRef = React.createRef();
    this.contextRef = React.createRef();
    this.state = {
      width: this.storage.width,
      height: this.storage.height
    };
  }
  onPress = () => {
    this.props.navigation.openDrawer();
  };

  handleWidthChange = (text: string): void => {
    // this.state.width = parseInt(text);
    this.setState({ width: parseInt(text) });
  };
  handleHeightChange = (text: string): void => {
    // this.state.height = parseInt(text);
    this.setState({ height: parseInt(text) });
  };
  onExit = () => {
    if (this.state.width % 8 == 0 && this.state.height % 8 == 0) {
      if (
        this.state.width !== this.storage.width ||
        this.state.height !== this.storage.height
      ) {
        this.storage.setHeight(this.state.height);
        this.storage.setWidth(this.state.width);
        if (this.storage.ESPConn) {
          const data = 'size' + this.state.height + ' ' + this.state.width;
          this.storage.socketInstance.send(data);
        }
      }
      if (this.storage.ESPConn) {
        this.storage.socketInstance.send('TYPE' + this.storage.MatrixType);
      }
    } else {
      this.props.navigation.toggleDrawer();
      this.props.navigation.navigate('Settings');

      alert('WARNING: The display sizes must be multiples of 8');
    }
  };
  handleMatrixTypechange = (matrixType: string) => {
    this.storage.setMatrixType(matrixType);
  };
  onEnter = () => {
    this.storage.focusedScreen = 'Settings';
    if (this.storage.ESPConn) {
      setTimeout(() => {
        this.storage.socketInstance.send('SETT');
      }, 200);
    }
  };
  connect = () => {
    setTimeout(() => {
      this.contextRef.current.restartConnection();
      setTimeout(() => {
        this.storage.socketInstance.send('GTSZ');
        this.storage.socketInstance.addEventListener(
          'message',
          this.onReceiveSize
        );
      }, 500);
    }, 0);
  };
  updateSizeonConnection = (sizes: string[]) => {
    const newWidth = parseInt(sizes[1]);
    const newHeight = parseInt(sizes[0]);
    this.setState({ width: newWidth, height: newHeight });
    this.storage.setHeight(newHeight);
    this.storage.setWidth(newWidth);
    this.widthRef.current.onChange(sizes[1]);
    this.heightRef.current.onChange(sizes[0]);
  };
  onReceiveSize = (event: { data: string }) => {
    const rawdata = event.data;
    const sizes = rawdata.split(' ');
    this.updateSizeonConnection(sizes);
    this.storage.socketInstance.removeEventListener(
      'message',
      this.onReceiveSize
    );
  };
  closeWebSocket = () => {
    this.storage.close();
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <NavigationEvents onWillBlur={this.onExit} onWillFocus={this.onEnter} />
        <CommContextUpdater ref={this.contextRef} />
        <AppHeader title="Settings" navigation={this.props.navigation} />

        <View style={styles.body}>
          <ScrollView>
            <View
              style={{
                width: '100%',
                height: 20,
                backgroundColor: 'transparent'
              }}
            ></View>
            <NumberInput
              ref={this.widthRef}
              isCustomIcon={true}
              icon={'grid-width2'}
              iconSize={45}
              iconColor={'grey'}
              label={'Billboard Width:'}
              updateValue={this.handleWidthChange}
              borderColor={'#b0b0b0'}
              defaultValue={this.state.width.toString()}
            />
            <View
              style={{
                width: '100%',
                height: 20,
                backgroundColor: 'transparent'
              }}
            ></View>
            <NumberInput
              ref={this.heightRef}
              icon={'grid-height2'}
              iconColor="tomato"
              iconSize={40}
              isCustomIcon={true}
              label={'Billboard Height:'}
              updateValue={this.handleHeightChange}
              borderColor={'#b0b0b0'}
              defaultValue={this.state.height.toString()}
            />
            <View
              style={{
                width: '100%',
                height: 20,
                backgroundColor: 'transparent'
              }}
            ></View>

            <ValueDropDown
              label="Matrix Type:"
              icon="md-apps"
              data={MatrixType}
              iconSize={50}
              leftPadding={22}
              rightPadding={4}
              updateValue={this.handleMatrixTypechange}
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
              label={'Connect to ESP'}
              onPress={this.connect}
            />
            <CustomButton
              backgroundColor="#fff"
              borderColor="#d3d3d3"
              fontColor="#147EFB"
              label={'Close Connection'}
              onPress={this.closeWebSocket}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

/* eslint-disable no-undef */
import React from 'react';
import { View, ScrollView, Image } from 'react-native';
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
  matrixType: string;
}
export default class SettingsScreen extends React.PureComponent<Prop, State> {
  storage: LocalStorage;
  contextRef: React.RefObject<CommContextUpdater>;
  widthRef: React.RefObject<NumberInput>;
  heightRef: React.RefObject<NumberInput>;
  // matrixTypeRef: React.RefObject<ValueDropDown>;
  width: number;
  height: number;
  Width: string;
  updatedValues: boolean;

  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.widthRef = React.createRef();
    this.heightRef = React.createRef();
    this.contextRef = React.createRef();
    // this.matrixTypeRef = React.createRef();
    this.updatedValues = false;
    this.state = {
      width: this.storage.width,
      height: this.storage.height,
      matrixType: this.storage.MatrixType
    };
  }
  onPress = () => {
    this.props.navigation.openDrawer();
  };

  handleWidthChange = (text: string): void => {
    this.setState({ width: parseInt(text) });
    this.updatedValues = true;
  };
  handleHeightChange = (text: string): void => {
    this.setState({ height: parseInt(text) });
    this.updatedValues = true;
  };
  onExit = () => {
    const { width, height, matrixType } = this.state;

    // Verify max LED limit
    if (width * height <= 1024) {
      //identify the type of matrices involved
      if (matrixType === 'CJMCU-64' || matrixType === 'WS-2812-8x8') {
        // enforce height and width as multiples of 8
        if (width % 8 == 0 && height % 8 == 0) {
          if (this.updatedValues) {
            this.storage.setHeight(height);
            this.storage.setWidth(width);
            if (this.storage.ESPConn) {
              const data =
                'size' + height + ' ' + width + ' ' + this.storage.MatrixType;
              this.storage.socketInstance.send(data);
            }
          }
          this.updatedValues = false;
        } else {
          this.props.navigation.closeDrawer();
          this.props.navigation.navigate('Settings');
          alert('WARNING: The display sizes must be multiples of 8');
        }
      } else {
        if (this.updatedValues) {
          this.storage.setHeight(height);
          this.storage.setWidth(width);
          if (this.storage.ESPConn) {
            const data =
              'size' + height + ' ' + width + ' ' + this.storage.MatrixType;
            this.storage.socketInstance.send(data);
          }
        }
        this.updatedValues = false;
      }
    } else {
      this.props.navigation.closeDrawer();
      this.props.navigation.navigate('Settings');

      alert(
        'WARNING: The application supports only up to 1024 total LEDS. Please recheck the product of the width and length.'
      );
    }
  };
  handleMatrixTypechange = (matrixType: string) => {
    this.setState({ matrixType: matrixType });
    this.storage.setMatrixType(matrixType);
    this.updatedValues = true;
  };
  onEnter = () => {
    this.storage.focusedScreen = 'Settings';
    this.updatedValues = false;
    if (this.storage.ESPConn) {
      setTimeout(() => {
        this.storage.socketInstance.send('SETT');
      }, 200);
    }
  };
  connect = () => {
    this.contextRef.current.restartConnection();
    this.storage.socketInstance.addEventListener('message', this.ESPResponse);
  };
  ESPResponse = (event: MessageEvent) => {
    this.storage.socketInstance.removeEventListener(
      'message',
      this.ESPResponse
    );
    const data = event.data;
    const values = data.split('\n');
    if (values[0] === 'REJECT') {
      this.storage.socketInstance.close();
      alert(
        'WARNING: Only one client can connect to the ESP32 Controller. Verify that the live connection is shut down.'
      );
    } else {
      this.updateSettings(values);
    }
  };
  updateSettings = (data: string[]) => {
    this.updatedValues = true;
    const newWidth = parseInt(data[2]);
    const newHeight = parseInt(data[1]);
    const defaultFramesDisplayed = data[4].split(',').map(filename => {
      return filename.slice(1, filename.length);
    });

    if (defaultFramesDisplayed[0].length === 0) {
      this.storage.clearDefaultFrames();
    } else {
      this.storage.setDefaultFrames(defaultFramesDisplayed);
    }

    this.handleMatrixTypechange(data[3]);
    this.setState({ width: newWidth, height: newHeight });
    this.storage.setHeight(newHeight);
    this.storage.setWidth(newWidth);
    this.widthRef.current.onChange(data[2]);
    this.heightRef.current.onChange(data[1]);
  };
  onReceiveSize = (event: { data: string }) => {
    const rawdata = event.data;
    const sizes = rawdata.split(' ');
    this.updateSettings(sizes);
    this.storage.socketInstance.removeEventListener(
      'message',
      this.onReceiveSize
    );
  };
  closeWebSocket = () => {
    this.storage.close();
  };
  goToMatrixType = () => {
    this.props.navigation.navigate('MatrixType');
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
              leftPadding={6}
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
              leftPadding={6}
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
              leftPadding={15}
              rightPadding={4}
              defaultValue={this.state.matrixType}
              updateValue={this.handleMatrixTypechange}
              displayHelpIcon={true}
              goToScreen={this.goToMatrixType}
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

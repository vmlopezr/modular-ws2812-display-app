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
import styles from './Settings.style';
import NumberInput from '../../components/NumberInput';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomButton } from '../../components/CustomButton';
import CommContextUpdater from '../../components/CommContextUpdater';
import GlobalStyles from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
interface Prop {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export default class SettingsScreen extends React.Component<Prop, {}> {
  storage: LocalStorage;
  contextRef: any;
  width: number;
  height: number;
  Width: string;

  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.width = this.storage.width;
    this.height = this.storage.height;
    this.contextRef = React.createRef();
  }
  shouldComponentUpdate() {
    console.log('Checking if updating settings');
    return false;
  }
  onPress = () => {
    this.props.navigation.openDrawer();
  };

  handleWidthChange = (text: string): void => {
    this.width = parseInt(text);
  };
  handleHeightChange = (text: string): void => {
    this.height = parseInt(text);
  };
  onExit = () => {
    if (
      this.width !== this.storage.width ||
      this.height !== this.storage.height
    ) {
      this.storage.setHeight(this.height);
      this.storage.setWidth(this.width);
    }
  };
  connect = () => {
    setTimeout(() => {
      this.contextRef.current.restartConnection();
    }, 0);
  };
  closeWebSocket = () => {
    this.storage.close();
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <NavigationEvents onWillBlur={this.onExit} />
        <CommContextUpdater ref={this.contextRef} />
        <AppHeader title="Settings" navigation={this.props.navigation} />

        <View style={styles.body}>
          <ScrollView>
            <View
              style={{ width: '100%', height: 20, backgroundColor: '#ebebeb' }}
            ></View>
            <NumberInput
              isCustomIcon={true}
              icon={'grid-width2'}
              iconSize={45}
              iconColor={'grey'}
              label={'Billboard Width:'}
              updateValue={this.handleWidthChange}
              borderColor={'#b0b0b0'}
            />
            <View
              style={{ width: '100%', height: 20, backgroundColor: '#ebebeb' }}
            ></View>
            <NumberInput
              icon={'grid-height2'}
              iconColor="tomato"
              iconSize={40}
              isCustomIcon={true}
              label={'Billboard Height:'}
              updateValue={this.handleHeightChange}
              borderColor={'#b0b0b0'}
            />
            <View
              style={{ width: '100%', height: 20, backgroundColor: '#ebebeb' }}
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

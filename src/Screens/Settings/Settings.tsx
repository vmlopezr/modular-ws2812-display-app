import React from 'react';
import { View, Text, StatusBar, TextInput } from 'react-native';
import SharedData from '../../sharedData';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents
} from 'react-navigation';
import styles from './Settings.style';
import NumberInput from '../../components/NumberInput';
import { ScrollView } from 'react-native-gesture-handler';
interface Prop {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export default class SettingsScreen extends React.Component<Prop, {}> {
  WebSocket: SharedData;
  width: number;
  height: number;
  Width: string;
  constructor(props) {
    super(props);
    this.WebSocket = SharedData.getInstance();
    this.width = this.WebSocket.width;
    this.height = this.WebSocket.height;
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
      this.width !== this.WebSocket.width ||
      this.height !== this.WebSocket.height
    ) {
      this.WebSocket.setHeight(this.height);
      this.WebSocket.setWidth(this.width);
    }
  };
  render() {
    return (
      <ScrollView style={styles.page}>
        <NavigationEvents onWillBlur={this.onExit} />
        <StatusBar barStyle="light-content" />
        <View style={styles.body}>
          <NumberInput
            label={'Billboard Width:'}
            updateValue={this.handleWidthChange}
          />
          <NumberInput
            label={'Billboard Height:'}
            updateValue={this.handleHeightChange}
          />
        </View>
      </ScrollView>
    );
  }
}

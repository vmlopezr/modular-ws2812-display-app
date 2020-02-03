import React from 'react';
import { View, Text, StatusBar, TextInput } from 'react-native';
import { SettingsContext } from '../../contexts/SettingsContext';
import SharedData from '../../sharedData';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents
} from 'react-navigation';
import styles from './Settings.style';
interface Prop {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export default class SettingsScreen extends React.Component<Prop, {}> {
  WebSocket: SharedData;
  width: number;
  height: number;
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
  isNormalInteger(text) {
    const n = Math.floor(Number(text));
    return n !== Infinity && String(n) === text && n >= 0;
  }
  handlewidthChange(text: string): void {
    if (this.isNormalInteger(text)) {
      this.width = parseInt(text);
    } else {
      alert('This field only accepts positive numbers.');
    }
  }
  handleheightChange(text: string): void {
    if (this.isNormalInteger(text)) {
      this.height = parseInt(text);
    } else {
      alert('This field only accepts positive numbers.');
    }
  }
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
      <View style={styles.page}>
        <NavigationEvents onWillBlur={this.onExit} />
        <StatusBar barStyle="light-content" />
        <View style={styles.body}>
          <Text>Billboard Width:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'black' }}
            placeholder="Enter Billboard width..."
            blurOnSubmit={true}
            returnKeyType="done"
            onEndEditing={({ nativeEvent }) =>
              this.handlewidthChange(nativeEvent.text)
            }
          />
          <Text>Billboard Height:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'black' }}
            placeholder="Enter Billboard height..."
            returnKeyType="done"
            onEndEditing={({ nativeEvent }) =>
              this.handleheightChange(nativeEvent.text)
            }
          />
        </View>
      </View>
    );
  }
}

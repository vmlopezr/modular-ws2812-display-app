import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import ConnectionBadge from '../../components/connectionBadge';
import styles from './MessageScreen.style.';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  screenProps: {
    ESPConn: boolean;
  };
}
interface State {
  isFocused: boolean;
}

class MessageScreen extends React.Component<Props, State> {
  connectionRef: any;
  constructor(props) {
    super(props);
    this.connectionRef = React.createRef();
    this.state = {
      isFocused: false
    };
  }
  onMenuTouch() {
    alert('Pressed the Menu Button');
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.screenProps.ESPConn !== nextProps.screenProps.ESPConn) {
      this.connectionRef.current.updateState(nextProps.screenProps.ESPConn);
    }

    if (this.state.isFocused !== nextState.isFocused) {
      return true;
    } else {
      return false;
    }
  }
  onPress = () => {
    this.props.navigation.openDrawer();
  };
  render() {
    return (
      <View style={styles.page}>
        <StatusBar barStyle="light-content" />
        <View style={styles.body}></View>
      </View>
    );
  }
}
export default MessageScreen;

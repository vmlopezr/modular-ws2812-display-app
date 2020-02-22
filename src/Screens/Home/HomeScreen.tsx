import React from 'react';
import { View, SafeAreaView } from 'react-native';
import styles from './HomeScreen.style.';
import LocalStorage from '../../LocalStorage';
import AppHeader from '../../components/AppHeader';
import { screenWidth } from '../GlobalStyles';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';

import { CustomButton } from '../../components/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';

import GlobalStyles from '../GlobalStyles';
interface Props {
  isFocused: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  width: number;
  height: number;
  read: boolean;
  write: boolean;
}

class HomeScreen extends React.Component<Props, State> {
  width: number;
  height: number;
  storage: LocalStorage;

  constructor(props) {
    super(props);

    this.storage = LocalStorage.getInstance();
    this.width = this.storage.width;
    this.height = this.storage.height;
  }
  startLineAnimation = () => {
    if (this.storage.ESPConn) {
      this.storage.socketInstance.send('ANIM');
    }
  };
  stopLineAnimation = () => {
    if (this.storage.ESPConn) {
      this.storage.socketInstance.send('STLI');
    }
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <AppHeader title="Home" navigation={this.props.navigation} />
        <View style={styles.body}></View>
      </SafeAreaView>
    );
  }
}
export default HomeScreen;

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

  goToSettings = () => {
    this.props.navigation.navigate('Settings');
  };
  goToAnimations = () => {
    this.props.navigation.navigate('Animations');
  };
  goToDefaultDisplay = () => {
    if (this.storage.ESPConn) {
      this.props.navigation.navigate('Default');
    } else {
      alert(
        'Warning: Live connection with the ESP32 is needed to set defaults.'
      );
    }
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <AppHeader title="Home" navigation={this.props.navigation} />
        <View style={styles.body}>
          <ScrollView>
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
              label={'Animations'}
              width={screenWidth}
              onPress={this.goToAnimations}
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
              label={'Set Display'}
              width={screenWidth}
              onPress={this.goToDefaultDisplay}
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
              label={'Settings'}
              width={screenWidth}
              onPress={this.goToSettings}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
export default HomeScreen;

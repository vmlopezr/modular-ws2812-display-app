import React from 'react';
import { View, SafeAreaView, Image, Text, Platform } from 'react-native';
import styles from './HomeScreen.style.';
import LocalStorage from '../../LocalStorage';
import AppHeader from '../../components/AppHeader';
import { screenWidth } from '../GlobalStyles';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents
} from 'react-navigation';

import { CustomButton } from '../../components/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';

import GlobalStyles from '../GlobalStyles';
interface Props {
  isFocused: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface ImgData {
  image: any;
  height: number;
  width: number;
}
interface State {
  // width: number;
  // height: number;
  // read: boolean;
  // write: boolean;
  imageData: ImgData;
}

class HomeScreen extends React.PureComponent<Props, State> {
  width: number;
  height: number;
  storage: LocalStorage;
  prevMatrixType: string;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.width = this.storage.width;
    this.height = this.storage.height;
    this.prevMatrixType = this.storage.MatrixType;
    this.state = { imageData: this.getMatrixImage() };
  }

  onEnter = () => {
    this.storage.focusedScreen = 'Home';
    if (this.prevMatrixType !== this.storage.MatrixType) {
      this.setState({ imageData: this.getMatrixImage() });
      this.prevMatrixType = this.storage.MatrixType;
    }
  };
  goToSettings = () => {
    this.props.navigation.navigate('Settings');
  };
  goToAnimations = () => {
    this.props.navigation.navigate('Animations');
  };
  goToDrawMatrix = () => {
    this.props.navigation.navigate('Draw');
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
  getMatrixImage = (): ImgData => {
    const matrixType = this.storage.MatrixType;
    if (matrixType === 'CJMCU-64') {
      return {
        height: Platform.OS === 'ios' ? 298 : 337,
        width: Platform.OS === 'ios' ? 310 : 350,
        image: require('../../../assets/CJMCU.png')
      };
    } else if (matrixType === 'WS-2812-8x8') {
      return {
        height: Platform.OS === 'ios' ? 298 : 337,
        width: Platform.OS === 'ios' ? 310 : 350,
        image: require('../../../assets/WS2812-Matrix.png')
      };
    } else if (matrixType === 'CUSTOM-CJMCU') {
      return {
        height: Platform.OS === 'ios' ? 304 : 344,
        width: Platform.OS === 'ios' ? 310 : 350,
        image: require('../../../assets/Custom-CJMCU-9x9.png')
      };
    } else {
      return {
        height: Platform.OS === 'ios' ? 304 : 344,
        width: Platform.OS === 'ios' ? 310 : 350,
        image: require('../../../assets/Custom-WS2812-Matrix-9x9.png')
      };
    }
  };
  render() {
    const imageData = this.state.imageData;
    const matrixType = this.storage.MatrixType;
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <AppHeader title="Home" navigation={this.props.navigation} />
        <NavigationEvents onWillFocus={this.onEnter} />
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.spacer}></View>

            <CustomButton
              backgroundColor="#fff"
              borderColor="#d3d3d3"
              fontColor="#147EFB"
              label={'Animations'}
              width={screenWidth}
              onPress={this.goToAnimations}
            />
            <View style={styles.spacer}></View>

            <CustomButton
              backgroundColor="#fff"
              borderColor="#d3d3d3"
              fontColor="#147EFB"
              label={'Matrix Draw'}
              width={screenWidth}
              onPress={this.goToDrawMatrix}
            />
            <View style={styles.spacer}></View>

            <CustomButton
              backgroundColor="#fff"
              borderColor="#d3d3d3"
              fontColor="#147EFB"
              label={'Set Display'}
              width={screenWidth}
              onPress={this.goToDefaultDisplay}
            />
            <View style={styles.spacer}></View>

            <CustomButton
              backgroundColor="#fff"
              borderColor="#d3d3d3"
              fontColor="#147EFB"
              label={'Settings'}
              width={screenWidth}
              onPress={this.goToSettings}
            />
            <View style={styles.imageContainer}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                {matrixType}
              </Text>
              <Image
                style={{ height: imageData.height, width: imageData.width }}
                source={imageData.image}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
export default HomeScreen;

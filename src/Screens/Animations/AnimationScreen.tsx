import React from 'react';
import { View } from 'react-native';
import styles, { animations } from './AnimationScreen.style';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
  NavigationEvents,
  ScrollView
} from 'react-navigation';
import GlobalStyles, { screenWidth } from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import LocalStorage from '../../LocalStorage';
import ValueDropDown from '../../components/ValueDropDown';
import { CustomButton } from '../../components/CustomButton';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  isFocused: boolean;
  count: number;
  startButtonDisabled: boolean;
  stopButtonDisabled: boolean;
}

class AnimationScreen extends React.PureComponent<Props, State> {
  connectionRef: any;
  storage: LocalStorage;
  displayEffect: string;
  constructor(props) {
    super(props);
    this.connectionRef = React.createRef();
    this.storage = LocalStorage.getInstance();
    this.displayEffect = '';

    this.state = {
      isFocused: false,
      count: 0,
      startButtonDisabled: false,
      stopButtonDisabled: true
    };
  }
  updateCount = (): void => {
    const newcount = this.state.count + 1;
    this.setState({ count: newcount });
  };
  onPress = () => {
    this.props.navigation.toggleDrawer();
  };
  onEnter = () => {
    this.storage.focusedScreen = 'Draw';
  };
  onExit = () => {
    this.setState({ startButtonDisabled: false, stopButtonDisabled: true });
    if (this.storage.ESPConn) {
      this.storage.socketInstance.send('STLI');
    }
  };
  handleEffectchange = (effect: string) => {
    this.displayEffect = effect;
  };
  animationMessage = () => {
    if (this.displayEffect === 'Single Pixel') {
      return 'PIXL';
    } else if (this.displayEffect === 'Horizontal Line') {
      return 'HLNE';
    } else if (this.displayEffect === 'Vertical Line') {
      return 'VLNE';
    }
  };
  startLineAnimation = () => {
    if (this.storage.ESPConn) {
      this.setState({ startButtonDisabled: true, stopButtonDisabled: false });
      this.storage.socketInstance.send('ANIM' + this.animationMessage());
    }
  };
  stopLineAnimation = () => {
    if (this.storage.ESPConn) {
      this.setState({ startButtonDisabled: false, stopButtonDisabled: true });
      this.storage.socketInstance.send('STLI');
    }
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <AppHeader title="Animations" navigation={this.props.navigation} />
        <NavigationEvents onWillFocus={this.onEnter} onWillBlur={this.onExit} />
        <View style={styles.body}>
          <ScrollView>
            <View
              style={{
                width: '100%',
                height: 20,
                backgroundColor: 'transparent'
              }}
            ></View>
            <ValueDropDown
              label="Animation:"
              icon="ios-star-half"
              data={animations}
              iconSize={30}
              updateValue={this.handleEffectchange}
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
              label={'Start Animation'}
              width={screenWidth}
              onPress={this.startLineAnimation}
              disable={this.state.startButtonDisabled}
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
              label={'Stop Animation'}
              width={screenWidth}
              onPress={this.stopLineAnimation}
              disable={this.state.stopButtonDisabled}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
export default AnimationScreen;

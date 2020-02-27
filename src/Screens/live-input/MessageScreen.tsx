import React from 'react';
import { View, StatusBar, Dimensions } from 'react-native';
import styles, { fonts, fontSizes } from './MessageScreen.style.';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents,
  ScrollView,
  SafeAreaView
} from 'react-navigation';
import ValueDropDown from '../../components/ValueDropDown';
import GlobalStyles from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import LocalStorage from '../../LocalStorage';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  isFocused: boolean;
  count: number;
}

class MessageScreen extends React.PureComponent<Props, State> {
  connectionRef: any;
  screenWidth: number;
  fontSize: string;
  font: string;
  storage: LocalStorage;
  constructor(props) {
    super(props);
    this.screenWidth = Math.round(Dimensions.get('window').width);
    this.state = {
      isFocused: false,
      count: 0
    };
    this.font = fonts[0];
    this.fontSize = fontSizes[0];
    this.storage = LocalStorage.getInstance();
  }
  onMenuTouch() {
    alert('Pressed the Menu Button');
  }
  updateCount = (): void => {
    const newcount = this.state.count + 1;
    this.setState({ count: newcount });
  };
  onPress = () => {
    this.props.navigation.toggleDrawer();
  };
  onEnter = () => {
    this.storage.focusedScreen = 'Message';
    // console.log('entered message screen');
  };
  handleFontSizeChange = (size: string) => {
    this.fontSize = size;
  };
  handleFontChange = (font: string) => {
    this.font = font;
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <StatusBar barStyle="light-content" />
        <NavigationEvents onDidFocus={this.onEnter} />
        <AppHeader
          title="Billboard Typing"
          navigation={this.props.navigation}
        />

        <View style={styles.body} collapsable={false}>
          <View
            collapsable={false}
            style={{
              backgroundColor: 'white',
              width: this.screenWidth,
              height: this.screenWidth,
              borderBottomWidth: 1,
              borderColor: '202020',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          ></View>
          <View
            collapsable={false}
            style={{
              alignItems: 'center',
              width: this.screenWidth,
              height: '100%'
            }}
          >
            <ScrollView style={{ flex: 1, width: this.screenWidth }}>
              <ValueDropDown
                label="Font Size:"
                data={fontSizes}
                icon="font-size"
                isCustomIcon={true}
                iconSize={30}
                updateValue={this.handleFontSizeChange}
              />
              <View
                style={{
                  width: '100%',
                  height: 20,
                  backgroundColor: 'transparent'
                }}
              ></View>
              <ValueDropDown
                label="Fonts:"
                icon="font-icon2"
                data={fonts}
                iconSize={30}
                isCustomIcon={true}
                updateValue={this.handleFontChange}
              />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default MessageScreen;

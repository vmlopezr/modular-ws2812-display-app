import React from 'react';
import { View, StatusBar, Dimensions } from 'react-native';
import styles, { fonts, fontSizes } from './MessageScreen.style.';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents,
  ScrollView
} from 'react-navigation';
import ValueDropDown from '../../components/ValueDropDown';
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
  constructor(props) {
    super(props);
    this.screenWidth = Math.round(Dimensions.get('window').width);
    this.state = {
      isFocused: false,
      count: 0
    };
    this.font = fonts[0];
    this.fontSize = fontSizes[0];
  }
  onMenuTouch() {
    alert('Pressed the Menu Button');
  }
  updateCount = (): void => {
    const newcount = this.state.count + 1;
    this.setState({ count: newcount });
  };
  onPress = () => {
    this.props.navigation.openDrawer();
  };
  onEnter = () => {
    console.log('entered message screen');
  };
  handleFontSizeChange = (size: string) => {
    this.fontSize = size;
  };
  handleFontChange = (font: string) => {
    this.font = font;
  };
  render() {
    return (
      <ScrollView>
        {/* <Loader loading={this.loading} /> */}
        <StatusBar barStyle="light-content" />
        <NavigationEvents onDidFocus={this.onEnter} />
        <View style={styles.body} collapsable={false}>
          <View
            collapsable={false}
            style={{
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 1,
              width: this.screenWidth,
              height: this.screenWidth,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          ></View>
          <View
            collapsable={false}
            style={{
              alignItems: 'center',
              width: this.screenWidth
            }}
          >
            <ValueDropDown
              label="Font Size:"
              data={fontSizes}
              icon="font-size"
              isCustomIcon={true}
              iconSize={30}
              updateValue={this.handleFontSizeChange}
            />
            <View
              style={{ width: '100%', height: 20, backgroundColor: '#ebebeb' }}
            ></View>
            <ValueDropDown
              label="Fonts:"
              icon="font-icon2"
              data={fonts}
              iconSize={30}
              isCustomIcon={true}
              updateValue={this.handleFontChange}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default MessageScreen;

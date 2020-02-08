import React from 'react';
import { View, StatusBar, Dimensions } from 'react-native';
import styles from './MessageScreen.style.';
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
  data: string[];
  constructor(props) {
    super(props);
    this.screenWidth = Math.round(Dimensions.get('window').width);
    this.state = {
      isFocused: false,
      count: 0
    };
    this.data = [];
    for (let i = 1; i < 10; i++) {
      this.data.push(i.toString());
    }
    this.fontSize = this.data[0];
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
              width: this.screenWidth,
              backgroundColor: 'blue'
            }}
          >
            <ValueDropDown
              label="Font Size:"
              data={this.data}
              updateValue={this.handleFontSizeChange}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default MessageScreen;

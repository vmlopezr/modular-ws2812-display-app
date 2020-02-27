import React from 'react';
import { View, Text, Animated } from 'react-native';
import styles from './DefaultScreen.style';
import { CustomButton } from '../../components/CustomButton';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
  NavigationEvents
} from 'react-navigation';
import GlobalStyles from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import LocalStorage from '../../LocalStorage';
import FrameComponent from './FrameComponent';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  list: string[];
  scroll: boolean;
}

class DefaultScreen extends React.PureComponent<Props, State> {
  storage: LocalStorage;
  count: number;
  _scrollRef: React.RefObject<ScrollView>;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.state = {
      list: ['value 1', 'value 2', 'value 3'],
      scroll: true
    };
    this.count = 3;
    this._scrollRef = React.createRef();
  }

  onEnter = () => {
    this.storage.focusedScreen = 'Preview';
  };
  addItem = () => {
    this.count++;
    const temp = this.state.list.concat('value ' + this.count);
    this.setState({ list: temp });
  };
  onSelect = () => {
    console.log('selecting frame');
  };
  setScroll = (scroll: boolean) => {
    this.setState({ scroll: scroll });
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <NavigationEvents onWillFocus={this.onEnter} />
        <AppHeader title="Set Display" navigation={this.props.navigation} />
        <View style={styles.header}>
          <View style={{ flex: 4 }}></View>
          <View style={{ flex: 1 }}>
            <CustomButton
              onPress={this.onSelect}
              label={'Select'}
              fontColor="#147EFB"
              backgroundColor="transparent"
            />
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView scrollEnabled={this.state.scroll}>
            {this.state.list.map((value, index) => {
              return (
                <FrameComponent
                  key={index}
                  label={value}
                  setScroll={this.setScroll}
                />
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <CustomButton
            onPress={this.addItem}
            label={'Add Frame'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default DefaultScreen;

import React from 'react';
import {
  View,
  Text,
  Animated,
  PanResponderInstance,
  PanResponder
} from 'react-native';
import styles from './DefaultScreen.style';
import { CustomButton } from '../../components/CustomButton';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
  NavigationEvents
} from 'react-navigation';
import GlobalStyles, { screenWidth } from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import LocalStorage from '../../LocalStorage';
import FrameComponent from './FrameItem';
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
  refList: React.RefObject<FrameComponent>[];
  _scrollRef: React.RefObject<ScrollView>;
  panResponder: PanResponderInstance;
  _moveTimeout: NodeJS.Timeout;
  _move: boolean;
  itemSelected: number;
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    const list = ['value 1', 'value 2', 'value 3'];
    this.state = {
      list: list,
      scroll: true
    };
    this.createRefList(list);
    this._move = false;
    this.count = 3;
    this.itemSelected = 0;
    this._scrollRef = React.createRef();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (event, gestureState) => {
        this.itemSelected = Math.floor(event.nativeEvent.locationY / 150);
        this._moveTimeout = setTimeout(() => {
          this.setScroll(false);
          this._move = true;
          this.refList[this.itemSelected].current.isSelected(true);
        }, 300);
      },
      onPanResponderMove: (event, gestureState) => {
        if (this._move) {
          this.refList[this.itemSelected].current.onMove(gestureState);
        }
      },
      onPanResponderRelease: () => this.onRelease(),
      onPanResponderTerminate: () => this.onRelease()
    });
  }
  onRelease = () => {
    clearTimeout(this._moveTimeout);
    this._move = false;
    this.setScroll(true);
    this.refList[this.itemSelected].current.onRelease();
    this.refList[this.itemSelected].current.isSelected(false);
  };
  createRefList = currList => {
    const list = [];
    for (let i = 0; i < currList.length; i++) {
      list.push(React.createRef());
    }
    this.refList = list;
  };

  onEnter = () => {
    this.storage.focusedScreen = 'Preview';
  };
  addItem = () => {
    this.count++;
    const temp = this.state.list.concat('value ' + this.count);
    this.refList.push(React.createRef());
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
            <View
              {...this.panResponder.panHandlers}
              style={{
                width: screenWidth,
                height: this.state.list.length * 150
              }}
            >
              <View pointerEvents="box-only">
                {this.state.list.map((value, index) => {
                  return (
                    <FrameComponent
                      ref={this.refList[index]}
                      key={index}
                      label={value}
                      setScroll={this.setScroll}
                    />
                  );
                })}
              </View>
            </View>
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

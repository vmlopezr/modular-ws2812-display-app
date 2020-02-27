import React from 'react';
import { screenWidth } from '../GlobalStyles';
import {
  View,
  Animated,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
const styles = StyleSheet.create({
  text: {
    color: '#fff'
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: 150,
    backgroundColor: '#1abc9c'
  }
});
interface State {
  dropZoneValues: any;
  pan: Animated.ValueXY;
  isSelected: boolean;
}
interface Props {
  label: string;
  setScroll(scroll: boolean): void;
}
export default class FrameComponent extends React.PureComponent<Props, State> {
  panResponder: PanResponderInstance;
  _move: boolean;
  _moveTimeout: NodeJS.Timeout;
  constructor(props) {
    super(props);
    this._move = false;
    this.state = {
      dropZoneValues: null,
      pan: new Animated.ValueXY(),
      isSelected: false
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: () => {
        this._moveTimeout = setTimeout(() => {
          this.props.setScroll(false);
          this._move = true;
          this.setState({ isSelected: true });
        }, 300);
      },
      onPanResponderMove: (event, gestureState) => {
        if (this._move) {
          console.log(
            'relative: ' +
              event.nativeEvent.locationY +
              ' page: ' +
              event.nativeEvent.pageY
          );
          return Animated.event([
            null,
            {
              dy: this.state.pan.y
            }
          ])(event, gestureState);
        }
      },
      onPanResponderRelease: () => this.onRelease(),
      onPanResponderTerminate: () => {
        this.onRelease();
      }
    });
  }
  onRelease = () => {
    clearTimeout(this._moveTimeout);
    this._move = false;
    this.props.setScroll(true);
    this.setState({ isSelected: false });
    Animated.spring(this.state.pan, {
      toValue: { x: 0, y: 0 }
    }).start();
  };
  render() {
    const borderColor = this.state.isSelected ? 'black' : 'gray';
    const borderWidth = this.state.isSelected ? 4 : 1;
    const zIndex = this.state.isSelected ? 2 : 1;
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[this.state.pan.getLayout(), { zIndex: zIndex }]}
      >
        <View
          style={[
            styles.body,
            { borderColor: borderColor, borderWidth: borderWidth }
          ]}
        >
          <TouchableOpacity
            style={{ backgroundColor: 'red' }}
            onPressIn={() => console.log('pressed')}
          >
            <Text style={styles.text}>{this.props.label}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

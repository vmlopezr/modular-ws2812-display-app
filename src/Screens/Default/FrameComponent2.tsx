import React from 'react';
import { screenWidth } from '../GlobalStyles';
import {
  View,
  Animated,
  PanResponderInstance,
  StyleSheet,
  Text,
  TouchableOpacity,
  PanResponderGestureState
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
      pan: new Animated.ValueXY(),
      isSelected: false
    };
  }
  onMove = (gestureState: PanResponderGestureState) => {
    return Animated.event([{ dy: this.state.pan.y }])(gestureState);
  };
  onRelease = () => {
    Animated.spring(this.state.pan, {
      toValue: { x: 0, y: -150 }
    }).start();
    // this.state.pan.setValue({ x: 0, y: -150 });
  };
  isSelected = (selected: boolean) => {
    this.setState({ isSelected: selected });
  };
  render() {
    const borderColor = this.state.isSelected ? 'black' : 'gray';
    const borderWidth = this.state.isSelected ? 4 : 1;
    const zIndex = this.state.isSelected ? 2 : 1;
    return (
      <Animated.View style={[this.state.pan.getLayout(), { zIndex: zIndex }]}>
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

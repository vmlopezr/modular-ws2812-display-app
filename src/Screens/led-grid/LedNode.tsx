import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import LocalStorage from '../../LocalStorage';

interface Color {
  NodeColor: string;
  LedColor: string;
}
interface Props {
  index?: number;
  col?: number;
  row?: number;
  width?: number;
  color(): Color;
  onNodeUpdate(index: number, color: string);
}

interface State {
  backgroundcolor: string;
}

class LedNode extends React.Component<Props, State> {
  storage: LocalStorage;
  style = StyleSheet.create({
    node: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderColor: 'gray',
      borderWidth: 0.5,
      width: 25,
      height: 25
    }
  });
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.state = {
      backgroundcolor: '#0F0000'
    };
  }
  shouldComponentUpdate(nextProps, nextState): boolean {
    if (nextState.backgroundcolor !== this.state.backgroundcolor) {
      return true;
    } else if (nextProps.width !== this.props.width) {
      return true;
    } else {
      return false;
    }
  }
  handleTouch(): void {
    // console.log('row: ' + this.props.row + ' col: ' + this.props.col);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentcolor = this.props.color();
    let newcolor = '';
    if (this.state.backgroundcolor === currentcolor.NodeColor) {
      this.setState({ backgroundcolor: '#000000' });
      newcolor = '#000000';
    } else {
      this.setState({ backgroundcolor: currentcolor.NodeColor });
      newcolor = currentcolor.LedColor;
    }
    this.props.onNodeUpdate(this.props.index, newcolor);
    // return newcolor;
  }
  updateColor(color: string) {
    this.setState({ backgroundcolor: color });
  }
  resetColor(): void {
    this.setState({ backgroundcolor: '#000000' });
  }
  render() {
    return (
      <View
        collapsable={false}
        pointerEvents="none"
        style={[
          this.style.node,
          {
            backgroundColor: this.state.backgroundcolor,
            justifyContent: 'center',
            alignItems: 'center'
          }
        ]}
      ></View>
    );
  }
}
export default LedNode;

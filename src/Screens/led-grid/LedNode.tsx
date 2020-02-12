import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
interface Props {
  col: number;
  row: number;
  color(): string;
  onNodeUpdate(row: number, col: number, color: string);
}
interface State {
  backgroundcolor: string;
}

class LedNode extends React.Component<Props, State> {
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
    this.state = {
      // backgroundcolor: 'black'
      backgroundcolor: '#ffffff'
    };
  }
  shouldComponentUpdate(nextProps, nextState): boolean {
    if (nextState.backgroundcolor !== this.state.backgroundcolor) {
      return true;
    } else {
      return false;
    }
  }
  handleTouch(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentcolor = this.props.color();
    if (this.state.backgroundcolor === currentcolor) {
      // this.setState({ backgroundcolor: '#000000' });
      this.setState({ backgroundcolor: '#ffffff' });
    } else if (this.state.backgroundcolor !== currentcolor) {
      this.setState({ backgroundcolor: currentcolor });
    }
    this.props.onNodeUpdate(
      this.props.row,
      this.props.col,
      this.state.backgroundcolor
    );
  }
  updateColor(color: string) {
    this.setState({ backgroundcolor: color });
  }
  resetColor(): void {
    // this.setState({ backgroundcolor: '#000000' });
    this.setState({ backgroundcolor: '#ffffff' });
    this.props.onNodeUpdate(
      this.props.row,
      this.props.col,
      this.state.backgroundcolor
    );
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

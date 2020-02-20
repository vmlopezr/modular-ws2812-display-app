import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import LocalStorage from '../../LocalStorage';
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
      backgroundcolor: '#000000'
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
    let newcolor = '';
    if (this.state.backgroundcolor === currentcolor) {
      this.setState({ backgroundcolor: '#000000' });
      newcolor = '#000000';
    } else {
      this.setState({ backgroundcolor: currentcolor });
      newcolor = currentcolor;
    }
    this.props.onNodeUpdate(this.props.row, this.props.col, newcolor);
  }
  updateColor(color: string) {
    this.setState({ backgroundcolor: color });
  }
  resetColor(): void {
    this.setState({ backgroundcolor: '#000000' });
    this.props.onNodeUpdate(this.props.row, this.props.col, '#000000');
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
      >
        <Text style={{ color: 'white' }}>
          {this.props.row * this.storage.width + this.props.col}
        </Text>
      </View>
    );
  }
}
export default LedNode;

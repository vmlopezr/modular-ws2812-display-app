import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native';
import ColorSlider from './ColorSlider';

interface Props {
  onColorChange(color): void;
  clearScreen(): void;
}
interface State {
  RValue: number;
  GValue: number;
  BValue: number;
}
class ColorPicker extends React.Component<Props, State> {
  NodeColor: string;
  screenWidth: number;
  styles = StyleSheet.create({
    node: {
      width: 75,
      height: 75,
      borderColor: 'black',
      borderWidth: 0.5,
      flexDirection: 'column',
      marginTop: 25
    },
    button: {
      marginTop: 10,
      marginBottom: 30,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: '#1E6738',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff'
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      RValue: 100,
      GValue: 100,
      BValue: 100
    };
    this.NodeColor = '#ffffff';
    this.screenWidth = Math.round(Dimensions.get('window').width);
  }
  updateRValue = (value: number) => {
    this.setState({ RValue: value });
  };
  updateGValue = (value: number) => {
    this.setState({ GValue: value });
  };
  updateBValue = (value: number) => {
    this.setState({ BValue: value });
  };
  toHex(value: number): string {
    return ('0' + value.toString(16)).slice(-2);
  }
  updateNodeColor(): void {
    this.NodeColor =
      '#' +
      this.toHex(this.state.RValue) +
      this.toHex(this.state.GValue) +
      this.toHex(this.state.BValue);
    this.props.onColorChange(this.NodeColor);
  }
  render() {
    this.updateNodeColor();
    return (
      <View
        collapsable={false}
        style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}
      >
        <View
          collapsable={false}
          style={{
            flex: 2,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            height: 200
          }}
        >
          <ColorSlider
            Label={'R'}
            width={150}
            value={100}
            step={1}
            maximumValue={255}
            minimumValue={0}
            onValueChange={this.updateRValue}
          />

          <ColorSlider
            Label={'G'}
            width={150}
            value={100}
            step={1}
            maximumValue={255}
            minimumValue={0}
            onValueChange={this.updateGValue}
          />
          <ColorSlider
            Label={'B'}
            width={150}
            value={100}
            step={1}
            maximumValue={255}
            minimumValue={0}
            onValueChange={this.updateBValue}
          />
        </View>
        <View
          style={{
            flex: 1,
            // flexDirection: 'row',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 200
          }}
        >
          <View
            style={[this.styles.node, { backgroundColor: this.NodeColor }]}
          ></View>

          <TouchableOpacity
            onPress={this.props.clearScreen}
            style={this.styles.button}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>
              Clear Screen
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ColorPicker;

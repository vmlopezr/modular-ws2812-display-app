import React from 'react';
import { Text, View, StyleSheet, Slider } from 'react-native';
// import Slider from 'react-native-slider'

interface State {
  value: number;
}
interface Props {
  width: number;
  Label: string;
  value: number;
  step: number;
  maximumValue: number;
  minimumValue: number;
  onValueChange(value: number);
}

export default class ColorSlider extends React.Component<Props, State> {
  styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 32,
      flex: 1
    },
    thumb: {
      width: 24,
      height: 24,
      borderRadius: 24 / 2,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      shadowOpacity: 0.1
    }
  });
  value: number;
  step: number;
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.step = 1;
  }
  onValueChange = (value: number) => {
    this.props.onValueChange(value);
    this.setState({ value: value });
  };
  componentDidMount() {
    this.setState({ value: this.props.value });
  }
  render() {
    return (
      <View style={this.styles.container}>
        <View
          style={{
            flex: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 8,
              marginRight: 8,
              color: 'black'
            }}
          >
            {this.props.Label}{' '}
          </Text>
          <Slider
            value={this.props.value}
            step={this.props.step}
            maximumValue={this.props.maximumValue}
            minimumValue={this.props.minimumValue}
            onValueChange={this.onValueChange}
            style={{ width: this.props.width }}
          />
        </View>
        <View
          style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text
            style={{
              fontSize: 20,
              marginLeft: 15,
              fontWeight: 'bold',
              color: 'black'
            }}
          >
            {this.state.value}{' '}
          </Text>
        </View>
      </View>
    );
  }
}

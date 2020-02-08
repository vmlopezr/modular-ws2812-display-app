import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomIcon from './CustomIcon';
interface Props {
  label: string;
  updateValue: (value: string) => void;
  icon?: string;
  iconColor?: string;
  isCustomIcon?: boolean;
  iconSize?: number;
}
interface State {
  prevValue: string;
  value: string;
  backgroundColor: string;
}
const styles = StyleSheet.create({
  text: {
    flex: 3,
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 8
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e5ebee'
  }
});
class NumberInput extends React.PureComponent<Props, State> {
  inputRef: any;
  constructor(props) {
    super(props);
    this.state = {
      value: '1',
      prevValue: '1',
      backgroundColor: 'rgb(255,255,255'
    };
    this.inputRef = React.createRef();
  }
  handleValueChange = () => {
    if (this.isNormalInteger(this.state.value)) {
      this.setState({ prevValue: this.state.value });
      this.props.updateValue(this.state.value);
    } else {
      alert('This field only accepts positive, non-zero numbers');
      this.setState({ value: this.state.prevValue });
    }
  };
  isNormalInteger(text) {
    const n = Math.floor(Number(text));
    return n !== Infinity && String(n) === text && n > 0;
  }
  onChange = (text: string) => {
    this.setState({ value: text });
  };

  focusInput = () => {
    this.setState({ backgroundColor: 'rgb(200, 196, 196)' });
    setTimeout(
      () => {
        this.inputRef.current.focus();
        this.setState({ backgroundColor: 'rgb(255,255,255)' });
      },

      0
    );
  };
  placeIcon = () => {
    const color = this.props.iconColor ? this.props.iconColor : 'gray';
    const size = this.props.iconSize ? this.props.iconSize : 30;
    if (this.props.isCustomIcon) {
      return (
        <View style={{ paddingLeft: 15 }}>
          <CustomIcon name={this.props.icon} size={size} color={color} />
        </View>
      );
    } else {
      return (
        <View style={{ paddingLeft: 15 }}>
          <Ionicons name={this.props.icon} size={size} color={color} />
        </View>
      );
    }
  };
  render() {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.state.backgroundColor }
        ]}
        onTouchStart={this.focusInput}
      >
        {this.props.icon && this.placeIcon()}
        <Text style={styles.text}>{this.props.label}</Text>
        <TextInput
          ref={this.inputRef}
          style={{
            flex: 3,
            textAlign: 'right',
            paddingRight: 20,
            height: 49
          }}
          value={this.state.value}
          keyboardType="number-pad"
          returnKeyType="done"
          onChangeText={this.onChange}
          onEndEditing={this.handleValueChange}
        />
      </View>
    );
  }
}
export default NumberInput;

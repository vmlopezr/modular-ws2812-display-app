import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomIcon from './CustomIcon';
interface Props {
  label: string;
  updateValue: (value: string) => void;
  defaultValue?: string;
  icon?: string;
  iconColor?: string;
  isCustomIcon?: boolean;
  iconSize?: number;
  borderColor?: string;
  backgroundColor?: string;
  leftPadding?: number;
  rightPadding?: number;
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
    borderTopWidth: 1
  }
});
class NumberInput extends React.PureComponent<Props, State> {
  inputRef: React.RefObject<TextInput>;
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue ? this.props.defaultValue : '1',
      prevValue: this.props.defaultValue ? this.props.defaultValue : '1',
      backgroundColor: this.props.backgroundColor
        ? this.props.backgroundColor
        : '#fff'
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
    const backgroundColor = this.props.backgroundColor
      ? this.props.backgroundColor
      : '#fff';
    this.setState({ backgroundColor: 'rgb(200, 196, 196)' });
    setTimeout(
      () => {
        this.inputRef.current.focus();
        this.setState({ backgroundColor: backgroundColor });
      },

      0
    );
  };
  placeIcon = () => {
    const {
      color,
      iconSize,
      rightPadding,
      leftPadding,
      iconColor,
      icon,
      isCustomIcon
    } = this.props;
    const colorProp = iconColor ? iconColor : 'gray';
    const sizeProp = iconSize ? iconSize : 30;
    const leftPaddingProp = leftPadding ? leftPadding : 15;
    const rightPaddingProp = rightPadding ? rightPadding : 5;
    if (isCustomIcon) {
      return (
        <View
          style={{
            paddingLeft: leftPaddingProp,
            paddingRight: rightPaddingProp
          }}
        >
          <CustomIcon name={icon} size={sizeProp} color={colorProp} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            paddingLeft: leftPaddingProp,
            paddingRight: rightPaddingProp
          }}
        >
          <Ionicons name={icon} size={sizeProp} color={colorProp} />
        </View>
      );
    }
  };
  render() {
    const borderColor = this.props.borderColor
      ? this.props.borderColor
      : '#e5ebee';

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.state.backgroundColor,
            borderColor: borderColor
          }
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
            paddingRight: 40,
            height: 49,
            borderBottomWidth: 1,
            borderColor: '#d3d3d3',
            fontSize: 20
          }}
          defaultValue={this.state.value}
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

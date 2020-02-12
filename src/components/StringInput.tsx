import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomIcon from './CustomIcon';
interface Props {
  defaultValue?: string;
  label: string;
  updateValue: (value: string) => void;
  icon?: string;
  iconColor?: string;
  isCustomIcon?: boolean;
  iconSize?: number;
  borderColor?: string;
  backgroundColor?: string;
}
interface State {
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
class StringInput extends React.PureComponent<Props, State> {
  inputRef: React.RefObject<TextInput>;

  constructor(props) {
    super(props);
    const defaultValue = this.props.defaultValue ? this.props.defaultValue : '';
    this.state = {
      value: defaultValue,
      backgroundColor: this.props.backgroundColor
        ? this.props.backgroundColor
        : '#fff'
    };
    this.inputRef = React.createRef();
  }
  handleValueChange = () => {
    this.props.updateValue(this.state.value);
  };

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
            fontSize: 15
          }}
          value={this.state.value}
          returnKeyType="default"
          onChangeText={this.onChange}
          onEndEditing={this.handleValueChange}
        />
      </View>
    );
  }
}
export default StringInput;

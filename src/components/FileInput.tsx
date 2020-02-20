import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomIcon from './CustomIcon';
interface Props {
  defaultValue?: string;
  label: string;
  updateValue(value: string): void;
  icon?: string;
  iconColor?: string;
  isCustomIcon?: boolean;
  iconSize?: number;
  borderColor?: string;
  backgroundColor?: string;
}
interface State {
  prevValue: string;
  value: string;
}
const styles = StyleSheet.create({
  text: {
    flex: 2,
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
class FileInput extends React.PureComponent<Props, State> {
  inputRef: React.RefObject<TextInput>;

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      prevValue: ''
    };
    this.inputRef = React.createRef();
  }
  handleValueChange = () => {
    this.props.updateValue(this.state.value);
  };
  setFileName = (file: string) => {
    this.setState({ value: file });
  };
  onChange = (text: string) => {
    this.setState({ value: text.replace(/\s/g, '') });
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
      : 'transparent';
    const backgroundColor = this.props.backgroundColor
      ? this.props.backgroundColor
      : 'transparent';
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor
          }
        ]}
        onTouchStart={this.focusInput}
      >
        {this.props.icon && this.placeIcon()}
        <Text style={styles.text}>{this.props.label}</Text>
        <View style={{ flex: 4, borderWidth: 1, borderColor: borderColor }}>
          <TextInput
            ref={this.inputRef}
            style={{
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
      </View>
    );
  }
}
export default FileInput;

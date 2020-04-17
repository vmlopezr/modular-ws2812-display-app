import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
interface Props {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  width?: number | string;
  height?: number | string;
  fontColor?: string;
  fontSize?: number;
  borderColor?: string;
  disable?: boolean;

  icon?: string;
  iconColor?: string;
  iconSize?: number;
  leftPadding?: number;
  rightPadding?: number;
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    flex: 1
  },
  label: {
    fontWeight: 'bold',
    alignItems: 'center'
  }
});

const onPress = (props: Props) => () => {
  props.onPress();
};
const placeIcon = (props: Props) => {
  const { iconColor, iconSize, leftPadding, rightPadding } = props;
  const colorProp = iconColor ? iconColor : 'gray';
  const sizeProp = iconSize ? iconSize : 30;
  const leftPaddingProp = leftPadding ? leftPadding : 15;
  const rightPaddingProp = rightPadding ? rightPadding : 5;

  return (
    <View
      style={{
        paddingLeft: leftPaddingProp,
        paddingRight: rightPaddingProp
      }}
    >
      <Ionicons name={props.icon} size={sizeProp} color={colorProp} />
    </View>
  );
};

export const CustomButton = (props: Props) => {
  const width = props.width ? props.width : 'auto';
  const height = props.height ? props.height : 45;
  const fontColor = props.fontColor ? props.fontColor : 'black';
  const fontSize = props.fontSize ? props.fontSize : 16;
  const borderColor = props.borderColor ? props.borderColor : 'transparent';
  const backgroundColor = props.backgroundColor
    ? props.backgroundColor
    : 'transparent';
  const disabled = props.disable ? props.disable : false;
  const disabledBackgroundColor = disabled ? '#cccccc' : backgroundColor;
  const disabledFontColor = disabled ? '#666666' : fontColor;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabledBackgroundColor,
          borderColor: borderColor,
          width: width,
          height: height
        }
      ]}
      onPress={onPress(props)}
      disabled={disabled}
    >
      {props.icon && placeIcon(props)}
      <Text style={[styles.label, { color: disabledFontColor, fontSize }]}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

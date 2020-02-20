import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
interface Props {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  width?: number | string;
  height?: number | string;
  fontColor?: string;
  fontSize?: number;
  borderColor?: string;
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
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

export const CustomButton = (props: Props) => {
  const width = props.width ? props.width : 'auto';
  const height = props.height ? props.height : 45;
  const fontColor = props.fontColor ? props.fontColor : 'black';
  const fontSize = props.fontSize ? props.fontSize : 16;
  const backgroundColor = props.backgroundColor
    ? props.backgroundColor
    : 'transparent';
  const borderColor = props.borderColor ? props.borderColor : 'transparent';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          width: width,
          height: height
        }
      ]}
      onPress={onPress(props)}
    >
      <Text style={[styles.label, { color: fontColor, fontSize }]}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

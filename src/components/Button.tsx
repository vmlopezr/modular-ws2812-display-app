import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
interface Props {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  width?: number;
  fontColor?: string;
}
const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center'
  }
});
const onPress = (props: Props) => () => {
  props.onPress();
};
export const Button = (props: Props) => {
  const width = props.width ? props.width : 'auto';
  const fontColor = props.fontColor ? props.fontColor : 'black';
  const backgroundColor = props.backgroundColor
    ? props.backgroundColor
    : 'gray';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor, width: width }
      ]}
      onPress={onPress(props)}
    >
      <Text style={[styles.label, { color: fontColor }]}>{props.label}</Text>
    </TouchableOpacity>
  );
};

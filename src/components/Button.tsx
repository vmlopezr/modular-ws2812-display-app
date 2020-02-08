import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
interface Props {
  label: string;
  onPress: () => void;
  color: string;
  width?: number;
}
const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center'
  }
});
const onPress = (props: Props) => () => {
  props.onPress();
};
export const Button = (props: Props) => {
  const width = props.width ? props.width : 150;
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: props.color, width: width }]}
      onPress={onPress(props)}
    >
      <Text style={styles.label}>{props.label}</Text>
    </TouchableOpacity>
  );
};

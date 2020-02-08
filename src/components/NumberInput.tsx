import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
interface Props {
  label: string;
  updateValue: (value: string) => void;
}
interface State {
  prevValue: string;
  value: string;
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
  constructor(props) {
    super(props);
    this.state = {
      value: '1',
      prevValue: '1'
    };
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
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.label}</Text>
        <TextInput
          style={{
            flex: 5,
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

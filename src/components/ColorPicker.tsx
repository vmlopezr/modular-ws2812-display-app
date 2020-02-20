import React from 'react';
import { View, StyleSheet, Dimensions, Modal } from 'react-native';
import ColorSlider from './ColorSlider';
import { CustomButton } from './CustomButton';
import { screenWidth, screenHeight } from '../Screens/GlobalStyles';

interface Props {
  onColorChange(color): void;
  clearScreen(): void;
  initialState: {
    R: number;
    G: number;
    B: number;
  };
}
interface State {
  RValue: number;
  GValue: number;
  BValue: number;
  modalVisible: boolean;
}
const styles = StyleSheet.create({
  node: {
    width: 75,
    height: 75,
    borderColor: 'black',
    borderWidth: 0.5
  },
  button: {
    marginTop: 10,
    marginBottom: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#1E6738',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  modalBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080'
  },
  modal: {
    position: 'absolute',
    top: '60%',
    left: 0,
    zIndex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: screenHeight * 0.4,
    width: screenWidth,
    backgroundColor: '#ececf1'
  },
  modalHeader: {
    height: 50,
    width: '100%',
    borderColor: '#525252',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  ColorPickerArea: {
    flex: 1,
    flexDirection: 'row',
    height: screenHeight - 50,
    backgroundColor: 'transparent',
    width: '100%'
  }
});
class ColorPicker extends React.Component<Props, State> {
  NodeColor: string;
  screenWidth: number;

  constructor(props) {
    super(props);
    this.state = {
      RValue: this.props.initialState.R,
      GValue: this.props.initialState.G,
      BValue: this.props.initialState.B,
      modalVisible: false
    };
    this.NodeColor = '#fff';
    this.screenWidth = Math.round(Dimensions.get('window').width);
  }
  updateRValue = (value: number) => {
    this.setState({ RValue: value });
  };
  updateGValue = (value: number) => {
    this.setState({ GValue: value });
  };
  updateBValue = (value: number) => {
    this.setState({ BValue: value });
  };
  toHex(value: number): string {
    return ('0' + value.toString(16)).slice(-2);
  }
  updateNodeColor(): void {
    this.NodeColor =
      '#' +
      this.toHex(this.state.RValue) +
      this.toHex(this.state.GValue) +
      this.toHex(this.state.BValue);
  }
  setModalVisibility = (isVisible: boolean) => () => {
    this.setState({ modalVisible: isVisible });
  };
  showModal = () => {
    this.setState({ modalVisible: true });
  };
  closeModal = () => {
    this.props.onColorChange(this.NodeColor);
    this.setState({ modalVisible: false });
  };

  render() {
    this.updateNodeColor();
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType="fade"
      >
        <View
          style={styles.modalBackground}
          onTouchEnd={this.closeModal}
        ></View>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 5 }}></View>
            <CustomButton
              width={60}
              backgroundColor="transparent"
              label="Done"
              fontColor="#147EFB"
              onPress={this.closeModal}
            />
          </View>
          <View style={styles.ColorPickerArea}>
            <View
              collapsable={false}
              style={{
                flex: 2,
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                height: 200
              }}
            >
              <ColorSlider
                Label={'R'}
                width={150}
                value={this.state.RValue}
                step={1}
                maximumValue={255}
                minimumValue={0}
                onValueChange={this.updateRValue}
              />

              <ColorSlider
                Label={'G'}
                width={150}
                value={this.state.GValue}
                step={1}
                maximumValue={255}
                minimumValue={0}
                onValueChange={this.updateGValue}
              />
              <ColorSlider
                Label={'B'}
                width={150}
                value={this.state.BValue}
                step={1}
                maximumValue={255}
                minimumValue={0}
                onValueChange={this.updateBValue}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <View
                style={[styles.node, { backgroundColor: this.NodeColor }]}
              ></View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ColorPicker;

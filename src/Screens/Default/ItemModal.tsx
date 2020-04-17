import React, { PureComponent } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { screenWidth, screenHeight } from '../../Screens/GlobalStyles';
import ValueDropDown from '../../components/ValueDropDown';
import NumberInput from '../../components/NumberInput';
import {
  EffectList,
  DirectionHorizontal,
  DirectionVertical
} from './DefaultScreen.style';

const modalHeight = screenHeight * 0.6;

const styles = StyleSheet.create({
  modalTransparentBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080'
  },
  modal: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: modalHeight,
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
  modalBody: {
    flex: 1,
    height: modalHeight - 50,
    backgroundColor: '#ececf1',
    width: '100%'
  },
  spacer: {
    width: '100%',
    height: 20,
    backgroundColor: 'transparent'
  }
});

interface Props {
  updateVisibility(value: boolean): void;
  updateEffect(value: string): void;
  updateDisplayTime(value: string): void;
  updateDirection(value: string): void;
  updateSlideSpeed(value: string): void;
  updateBlinkTime(value: string): void;
  defaultDirection: string;
  defaultSlideSpeed: string;
  defaultEffect: string;
  defaultDisplayTime: string;
  defaultBlinkTime: string;
  modalVisible: boolean;
  keyboardSpace: number;
}
interface State {
  Effect: string;
  displayTime: string;
  Direction: string;
  SlideSpeed: string;
  BlinkTime: string;
  slideComponentDisabled: boolean;
  noneComponentDisabled: boolean;
  blinkComponentDisabled: boolean;
}

class ItemModal extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    // console.log('constructor');
    const {
      defaultDirection,
      defaultSlideSpeed,
      defaultDisplayTime,
      defaultEffect,
      defaultBlinkTime
    } = this.props;
    const slideState =
      defaultEffect == 'None' || defaultEffect == 'Blink' ? true : false;
    this.state = {
      Effect: defaultEffect,
      displayTime: defaultDisplayTime,
      Direction: defaultDirection,
      SlideSpeed: defaultSlideSpeed,
      BlinkTime: defaultBlinkTime,
      slideComponentDisabled: slideState,
      noneComponentDisabled:
        defaultEffect === 'None' || defaultEffect === 'Blink' ? false : true,
      blinkComponentDisabled: defaultEffect === 'Blink' ? false : true
    };
  }

  closeModal = () => {
    this.props.updateVisibility(false);
  };
  handleEffectChange = (value: string) => {
    this.props.updateEffect(value);
    const newDirection = value === 'Vertical Slide' ? 'Up' : 'Right';
    const blinkComponentDisabled = value === 'Blink' ? false : true;
    const noneComponentDisabled =
      value === 'None' || value === 'Blink' ? false : true;
    const slideDisabled = value === 'None' || value === 'Blink' ? true : false;

    this.props.updateDirection(newDirection);
    this.setState({
      Effect: value,
      Direction: newDirection,
      slideComponentDisabled: slideDisabled,
      noneComponentDisabled: noneComponentDisabled,
      blinkComponentDisabled: blinkComponentDisabled
    });
  };
  handleDisplayTimeChange = (value: string) => {
    this.props.updateDisplayTime(value);
    this.setState({ displayTime: value });
  };
  handleDirectionChange = (value: string) => {
    this.props.updateDirection(value);
    this.setState({ Direction: value });
  };
  handleSlideSpeedChange = (value: string) => {
    this.props.updateSlideSpeed(value);
    this.setState({ SlideSpeed: value });
  };
  handleBlinkTimeChange = (value: string) => {
    this.props.updateBlinkTime(value);
    this.setState({ BlinkTime: value });
  };
  renderHeader = () => (
    <View style={styles.modalHeader}>
      <View style={{ flex: 4 }}></View>
      <View style={{ flex: 1 }}>
        <CustomButton
          width={60}
          backgroundColor="transparent"
          label="Done"
          fontColor="#147EFB"
          onPress={this.closeModal}
        />
      </View>
    </View>
  );
  renderDirectionData = (): string[] => {
    if (this.state.Effect === 'Vertical Slide') {
      return DirectionVertical;
    } else {
      return DirectionHorizontal;
    }
  };

  renderBody = () => {
    const displayTimeLabel =
      this.state.Effect === 'Blink' ? 'Display Time(s):' : 'Display Time(ms):';
    const minValueDisplay = this.state.Effect === 'Blink' ? 1 : 100;
    return (
      <ScrollView style={{ width: '100%' }}>
        <View style={styles.spacer}></View>
        <ValueDropDown
          label="Effect Types:"
          icon="ios-contract"
          data={EffectList}
          iconSize={45}
          leftPadding={18}
          rightPadding={4}
          defaultValue={this.state.Effect}
          updateValue={this.handleEffectChange}
        />
        <View style={styles.spacer}></View>
        <NumberInput
          label={displayTimeLabel}
          updateValue={this.handleDisplayTimeChange}
          defaultValue={this.state.displayTime}
          icon={'ios-clock'}
          iconColor={'gray'}
          iconSize={45}
          leftPadding={17}
          rightPadding={4}
          borderColor="#8f8f8f"
          minValue={minValueDisplay}
          disabled={this.state.noneComponentDisabled}
        />
        <View style={styles.spacer}></View>
        <NumberInput
          label="Blink Speed(s):"
          updateValue={this.handleBlinkTimeChange}
          defaultValue={this.state.BlinkTime}
          icon={'ios-clock'}
          iconColor={'gray'}
          iconSize={45}
          leftPadding={17}
          rightPadding={4}
          borderColor="#8f8f8f"
          minValue={1}
          disabled={this.state.blinkComponentDisabled}
        />
        <View style={styles.spacer}></View>
        <ValueDropDown
          label="Direction:"
          updateValue={this.handleDirectionChange}
          defaultValue={this.state.Direction}
          icon="ios-contract"
          data={this.renderDirectionData()}
          iconSize={45}
          leftPadding={18}
          rightPadding={4}
          disabled={this.state.slideComponentDisabled}
        />
        <View style={styles.spacer}></View>
        <NumberInput
          label="Slide Speed(ms):"
          updateValue={this.handleSlideSpeedChange}
          defaultValue={this.state.SlideSpeed}
          icon={'ios-clock'}
          iconColor={'gray'}
          iconSize={45}
          leftPadding={17}
          rightPadding={4}
          borderColor="#8f8f8f"
          minValue={60}
          disabled={this.state.slideComponentDisabled}
        />
        <View
          style={{ width: '100%', height: 100, backgroundColor: 'transparent' }}
        ></View>
      </ScrollView>
    );
  };

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.modalVisible}
        animationType="fade"
      >
        <View
          style={styles.modalTransparentBackground}
          onTouchEnd={this.closeModal}
        ></View>
        <View
          style={[
            styles.modal,

            {
              top: this.props.keyboardSpace
            }
          ]}
        >
          {this.renderHeader()}
          {this.renderBody()}
        </View>
      </Modal>
    );
  }
}
export default ItemModal;

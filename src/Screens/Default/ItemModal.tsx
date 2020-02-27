import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { screenWidth, screenHeight } from '../../Screens/GlobalStyles';
import ValueDropDown from '../../components/ValueDropDown';
import NumberInput from '../../components/NumberInput';
import { EffectList } from './DefaultScreen.style';

const modalHeight = screenHeight * 0.4;

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
    top: '60%',
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
    backgroundColor: 'transparent',
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
  updateDelay(value: string): void;
  updateDisplayTime(value: string): void;
  defaultDelay: string;
  defaultEffect: string;
  defaultDisplayTime: string;
  modalVisible: boolean;
}
interface State {
  Effect: string;
  delay: number;
}

class ItemModal extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      Effect: '',
      delay: 0
    };
  }

  closeModal = () => {
    this.props.updateVisibility(false);
  };
  handleEffectChange = (value: string) => {
    this.setState({ Effect: value });
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

  renderBody = () => (
    <ScrollView style={{ width: '100%' }}>
      <View style={styles.spacer}></View>
      <ValueDropDown
        label="Effect Types:"
        icon="ios-contract"
        data={EffectList}
        iconSize={45}
        leftPadding={18}
        rightPadding={4}
        defaultValue={this.props.defaultEffect}
        updateValue={this.props.updateEffect}
      />
      <View style={styles.spacer}></View>
      <NumberInput
        label="Display Time (s):"
        updateValue={this.props.updateDisplayTime}
        defaultValue={this.props.defaultDisplayTime}
        icon={'ios-clock'}
        iconColor={'gray'}
        iconSize={45}
        leftPadding={17}
        rightPadding={4}
        borderColor="#8f8f8f"
      />
      <View style={styles.spacer}></View>
      <NumberInput
        label="Delay (ms):"
        updateValue={this.props.updateDelay}
        defaultValue={this.props.defaultDelay}
        icon={'ios-clock'}
        iconColor={'gray'}
        iconSize={45}
        leftPadding={17}
        rightPadding={4}
        borderColor="#8f8f8f"
      />
    </ScrollView>
  );

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled>
        <Modal
          transparent={true}
          visible={this.props.modalVisible}
          animationType="fade"
        >
          <View
            style={styles.modalTransparentBackground}
            onTouchEnd={this.closeModal}
          ></View>
          <View style={styles.modal}>
            {this.renderHeader()}
            {this.renderBody()}
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}
export default ItemModal;

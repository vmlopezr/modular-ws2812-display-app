import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { CustomButton } from '../CustomButton';
import { screenWidth, screenHeight } from '../../Screens/GlobalStyles';
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
  }
});
interface State {
  modalVisible: boolean;
}
class ModalComponent extends React.Component<{}, State> {
  constructor(props) {
    super(props);
  }
  showModal = () => {
    this.setState({ modalVisible: true });
  };
  closeModal = () => {
    this.setState({ modalVisible: false });
  };
  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        animationType="fade"
      >
        <View
          style={styles.modalTransparentBackground}
          onTouchEnd={this.closeModal}
        ></View>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <CustomButton
              width={60}
              backgroundColor="transparent"
              label="Done"
              fontColor="#147EFB"
              onPress={this.closeModal}
            />
          </View>
          <View style={styles.modalBody}>
            {/* This area is used to display components in the body. */}
          </View>
        </View>
      </Modal>
    );
  }
}
export default ModalComponent;

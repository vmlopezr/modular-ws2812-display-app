import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { screenWidth } from '../GlobalStyles';

interface State {
  isSelected: boolean;
}
interface Props {
  selectedButton: boolean;
  itemSelected(index: number): void;
  itemDeSelected(index: number): void;
  isActive: boolean;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  label: string;
  drag: any;
  width?: number;
  height?: number;
  index: number;
}
export default class FrameComponent extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };
  }

  resetItem = () => {
    this.setState({ isSelected: false });
  };
  onSelect = () => {
    if (this.props.selectedButton) {
      if (!this.state.isSelected) {
        this.props.itemSelected(this.props.index);
        this.setState({ isSelected: true });
      } else {
        this.props.itemDeSelected(this.props.index);
        this.setState({ isSelected: false });
      }
    } else {
      console.log('open modal');
    }
  };
  setBackgroundColor = (): string => {
    const backgroundColor = this.props.backgroundColor
      ? this.props.backgroundColor
      : '#ebebeb';
    return this.props.selectedButton
      ? this.state.isSelected
        ? 'green'
        : backgroundColor
      : backgroundColor;
  };
  render() {
    const borderColorProp = this.props.borderColor
      ? this.props.borderColor
      : 'transparent';
    const borderColor = this.props.isActive ? '#000' : borderColorProp;
    const borderWidth = this.props.borderWidth ? this.props.borderWidth : 1;
    const width = this.props.width ? this.props.width : screenWidth;
    const height = this.props.height ? this.props.height : 150;

    return (
      <TouchableOpacity onPress={this.onSelect} onLongPress={this.props.drag}>
        <View
          style={{
            borderColor: borderColor,
            borderWidth: this.props.isActive ? 4 : borderWidth,
            backgroundColor: this.setBackgroundColor(),
            width: this.props.selectedButton ? width - 30 : width,
            height: this.props.selectedButton ? height * 0.9 : height,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 32
            }}
          >
            {this.props.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

// import React, { useState } from 'react';
// import { View, StyleSheet, Modal } from 'react-native';
// import { CustomButton } from '../../components/CustomButton';
// import { screenWidth, screenHeight } from '../../Screens/GlobalStyles';
// import ValueDropDown from '../../components/ValueDropDown';
// const modalHeight = screenHeight * 0.4;

// const styles = StyleSheet.create({
//   modalTransparentBackground: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#00000080'
//   },
//   modal: {
//     position: 'absolute',
//     top: '60%',
//     left: 0,
//     zIndex: 1,
//     alignItems: 'center',
//     flexDirection: 'column',
//     height: modalHeight,
//     width: screenWidth,
//     backgroundColor: '#ececf1'
//   },
//   modalHeader: {
//     height: 50,
//     width: '100%',
//     borderColor: '#525252',
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     flexDirection: 'row'
//   },
//   modalBody: {
//     flex: 1,
//     height: modalHeight - 50,
//     backgroundColor: 'transparent',
//     width: '100%'
//   }
// });
// const EffectList = ['Fade', 'Horizontal Slide', 'Vertical Slide'];
// interface Props {
//   updateVisibility(value: boolean): void;
//   modalVisible: boolean;
// }
// const closeModal = (props: Props) => () => {
//   props.updateVisibility(false);
// };
// const handleEffectChange = (
//   setEffect: React.Dispatch<React.SetStateAction<string>>
// ) => (value: string) => {
//   setEffect(value);
// };
// const ModalComponent = (props: Props) => {
//   const [delay, setDelay] = useState(0);
//   const [effect, setEffect] = useState('');
//   console.log('effect is: ' + effect);
//   return (
//     <Modal transparent={true} visible={props.modalVisible} animationType="fade">
//       <View
//         style={styles.modalTransparentBackground}
//         onTouchEnd={closeModal(props)}
//       ></View>
//       <View style={styles.modal}>
//         <View style={styles.modalHeader}>
//           <CustomButton
//             width={60}
//             backgroundColor="transparent"
//             label="Done"
//             fontColor="#147EFB"
//             onPress={closeModal(props)}
//           />
//         </View>
//         <View style={styles.modalBody}>
//           <View
//             style={{
//               width: '100%',
//               height: 20,
//               backgroundColor: 'transparent'
//             }}
//           ></View>
//           <ValueDropDown
//             label="Effect Types:"
//             icon="md-apps"
//             data={EffectList}
//             iconSize={50}
//             leftPadding={22}
//             rightPadding={4}
//             updateValue={handleEffectChange(setEffect)}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };
// export default ModalComponent;

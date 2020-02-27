import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { screenWidth } from '../GlobalStyles';
import ItemModal from './ItemModal';
import { EffectList } from './DefaultScreen.style';

interface State {
  isSelected: boolean;
  showModal: boolean;
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
  // Reset the background of the item when canceled
  Effect: string;
  Delay: string;
  displayTime: string;

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (!nextProps.selectedButton && prevState.isSelected) {
      return { isSelected: false };
    } else return null;
  }
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      showModal: false
    };
    this.Effect = EffectList[0];
    this.Delay = '0';
    this.displayTime = '0';
  }
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
      this.setState({ showModal: true });
    }
  };
  closeModal = () => {
    this.setState({ showModal: false });
  };
  setBackgroundColor = (): string => {
    const { backgroundColor, selectedButton } = this.props;
    const { isSelected } = this.state;
    const backgroundColorProp = backgroundColor ? backgroundColor : '#ebebeb';

    return selectedButton && isSelected ? 'green' : backgroundColorProp;
  };
  updateEffect = (value: string) => {
    this.Effect = value;
  };
  updateDelay = (value: string) => {
    this.Delay = value;
  };
  updateDisplayTime = (value: string) => {
    this.displayTime = value;
  };
  onPress = () => {
    if (!this.props.selectedButton) {
      this.props.drag();
    }
  };
  render() {
    const {
      borderColor,
      isActive,
      borderWidth,
      selectedButton,
      width,
      height,
      label
    } = this.props;
    const borderColorProp = borderColor ? borderColor : 'transparent';
    const borderWidthProp = borderWidth ? borderWidth : 1;
    const widthProp = width ? width : screenWidth;
    const heightProp = height ? height : 150;
    return (
      <TouchableOpacity
        onPress={this.onSelect}
        onLongPress={this.onPress}
        delayLongPress={200}
      >
        <View
          style={{
            borderColor: isActive ? '#000' : borderColorProp,
            borderWidth: isActive ? 4 : borderWidthProp,
            backgroundColor: this.setBackgroundColor(),
            width: selectedButton ? widthProp - 30 : widthProp,
            height: selectedButton ? heightProp * 0.9 : heightProp,
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
            {label}
          </Text>
        </View>

        <ItemModal
          modalVisible={this.state.showModal}
          updateVisibility={this.closeModal}
          updateEffect={this.updateEffect}
          defaultEffect={this.Effect}
          updateDelay={this.updateDelay}
          defaultDelay={this.Delay}
          updateDisplayTime={this.updateDisplayTime}
          defaultDisplayTime={this.displayTime}
        />
      </TouchableOpacity>
    );
  }
}

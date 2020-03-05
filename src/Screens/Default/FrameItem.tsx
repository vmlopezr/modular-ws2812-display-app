import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { screenWidth } from '../GlobalStyles';
import ItemModal from './ItemModal';
import FrameImage from './FrameImage';
interface FrameEffects {
  FileName: string;
  Effect: string;
  displayTime: string;
  Direction: string;
  SlideSpeed: string;
  BlinkTime: string;
  image: string;
}
interface State {
  isSelected: boolean;
  showModal: boolean;
}
interface Props {
  selectedButton: boolean;
  itemSelected(index: string): void;
  itemDeSelected(index: string): void;
  updateEffectProperty(filename: string, property: string, value: string): void;
  isActive: boolean;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  label: string;
  drag: any;
  displayWidth: number;
  displayHeight: number;
  data: FrameEffects;
  keyboardSpace: number;
}
const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    color: '#595959',
    fontSize: 13,
    paddingLeft: 12
  },
  selectedEffect: {
    fontWeight: 'bold',
    color: '#7f7f7f',
    fontSize: 13,
    paddingRight: 12
  },
  title: {
    fontWeight: 'bold',
    color: '#3f3f3f',
    fontSize: 16,
    paddingLeft: 12
  },
  activeItem: {
    borderColor: '#333',
    borderWidth: 1,
    backgroundColor: '#dbdbdb',
    width: screenWidth,
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default class FrameComponent extends React.PureComponent<Props, State> {
  // Reset the background of the item when canceled
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
  }
  onSelect = () => {
    if (this.props.selectedButton) {
      if (!this.state.isSelected) {
        this.props.itemSelected(this.props.label);
        this.setState({ isSelected: true });
      } else {
        this.props.itemDeSelected(this.props.label);
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

    return selectedButton && isSelected ? '#dbdbdb' : backgroundColorProp;
  };
  updateEffect = (value: string) => {
    this.props.updateEffectProperty(this.props.label, 'Effect', value);
  };
  updateDisplayTime = (value: string) => {
    this.props.updateEffectProperty(this.props.label, 'displayTime', value);
  };
  updateDirection = (value: string) => {
    this.props.updateEffectProperty(this.props.label, 'Direction', value);
  };
  updateSlideSpeed = (value: string) => {
    this.props.updateEffectProperty(this.props.label, 'SlideSpeed', value);
  };
  updateBlinkTime = (value: string) => {
    this.props.updateEffectProperty(this.props.label, 'BlinkTime', value);
  };
  onPress = () => {
    if (!this.props.selectedButton) {
      this.props.drag();
    }
  };
  renderData = (label, data) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.label, { flex: 1 }]}>{label}</Text>
        <Text style={[styles.selectedEffect, { flex: 1, textAlign: 'right' }]}>
          {data}
        </Text>
      </View>
    );
  };
  render() {
    const {
      borderColor,
      isActive,
      borderWidth,
      displayWidth,
      displayHeight,
      label,
      data
    } = this.props;
    const borderColorProp = borderColor ? borderColor : 'transparent';
    const borderWidthProp = borderWidth ? borderWidth : 0.5;
    const displayTimeLabel =
      data.Effect === 'Blink' ? 'Display Time(s):' : 'Display Time(ms):';
    return (
      <TouchableOpacity
        onPress={this.onSelect}
        onLongPress={this.onPress}
        delayLongPress={150}
      >
        <View
          style={[
            isActive ? styles.activeItem : null,
            {
              borderColor: !isActive ? borderColorProp : null,
              borderWidth: !isActive ? borderWidthProp : null,
              backgroundColor: this.setBackgroundColor(),
              width: screenWidth,
              height: 150,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
        >
          <FrameImage
            width={displayWidth}
            height={displayHeight}
            data={data.image}
          />
          <View
            style={{
              width: screenWidth - 150,
              height: 140
            }}
          >
            <Text style={[styles.title, { flex: 1 }]}>{label}</Text>
            <View style={{ flex: 2, justifyContent: 'space-evenly' }}>
              {this.renderData('Effect:', data.Effect)}
              {this.renderData(displayTimeLabel, data.displayTime)}
              {this.renderData('Blink Speed(s):', data.BlinkTime)}
              {this.renderData('Direction:', data.Direction)}
              {this.renderData('Sliding Speed(ms):', data.SlideSpeed)}
            </View>
          </View>
        </View>
        <ItemModal
          modalVisible={this.state.showModal}
          updateVisibility={this.closeModal}
          updateEffect={this.updateEffect}
          defaultEffect={data.Effect}
          updateDisplayTime={this.updateDisplayTime}
          defaultDisplayTime={data.displayTime}
          updateDirection={this.updateDirection}
          updateSlideSpeed={this.updateSlideSpeed}
          defaultDirection={data.Direction}
          defaultSlideSpeed={data.SlideSpeed}
          keyboardSpace={this.props.keyboardSpace}
          defaultBlinkTime={data.BlinkTime}
          updateBlinkTime={this.updateBlinkTime}
        />
      </TouchableOpacity>
    );
  }
}

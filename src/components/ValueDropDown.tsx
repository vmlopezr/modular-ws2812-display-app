//https://github.com/yasemincidem/react-native-picker-scrollview credit to
import React from 'react';
import {
  View,
  Text,
  Modal,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  GestureResponderEvent
} from 'react-native';
import styles from './styles/ValueDropDown.style';
import { CustomButton } from './CustomButton';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomIcon from './CustomIcon';
interface Props {
  label: string;
  updateValue: (value: string) => void;
  data: string[];
  icon?: string;
  iconColor?: string;
  isCustomIcon?: boolean;
  iconSize?: number;
}
interface State {
  valueIndex: number;
  modalVisible: boolean;
  backgroundColor: string;
}
const pickerItemHeight = 40;
class ValueDropDown extends React.PureComponent<Props, State> {
  dragStarted: boolean;
  timer: NodeJS.Timeout;
  momentumStarted: boolean;
  isScrollTo: boolean;
  scrollRef: any;
  prevIndex: number;

  constructor(props) {
    super(props);
    this.prevIndex = 0;
    this.state = {
      valueIndex: 0,
      modalVisible: false,
      backgroundColor: 'rgba(255,255,255,1)'
    };
    this.scrollRef = React.createRef();
  }
  scrollFix(e) {
    let verticalY = 0;
    if (e.nativeEvent.contentOffset) {
      verticalY = e.nativeEvent.contentOffset.y;
    }
    let verticalElem = 0;
    const selectedIndex = Math.round(verticalY / pickerItemHeight);
    if (selectedIndex <= 0) {
      verticalElem = 0;
    } else if (selectedIndex >= this.props.data.length - 1) {
      verticalElem = (this.props.data.length - 1) * pickerItemHeight;
    } else {
      verticalElem = selectedIndex * pickerItemHeight;
    }
    if (verticalElem !== verticalY) {
      if (Platform.OS === 'ios') {
        this.isScrollTo = true;
      }
      if (this.scrollRef) {
        this.scrollRef.current.scrollTo({ y: verticalElem });
      }
    }
    if (this.state.valueIndex === selectedIndex) {
      return;
    }

    this.setState({
      valueIndex: selectedIndex
    });

    this.props.updateValue(this.props.data[selectedIndex]);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  setModalVisibility = (isVisible: boolean) => () => {
    this.setState({ modalVisible: isVisible });
  };
  onScrollBeginDrag = () => {
    this.dragStarted = true;
    if (Platform.OS === 'ios') {
      this.isScrollTo = false;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.dragStarted = false;
    const element = {
      nativeEvent: {
        contentOffset: {
          y: e.nativeEvent.contentOffset.y
        }
      }
    };
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (!this.momentumStarted && !this.dragStarted) {
        this.scrollFix(element);
      }
    }, 10);
  };
  updateOpacity = () => {
    this.setState({ backgroundColor: 'rgb(200, 196, 196)' });
  };
  scrollToState = () => {
    const yPos = pickerItemHeight * this.state.valueIndex;
    setTimeout(() => {
      if (this.scrollRef) {
        this.scrollRef.current.scrollTo({ y: yPos });
      }
    }, 0);
    this.setState({ modalVisible: true, backgroundColor: 'rgb(255,255,255)' });
  };
  scrollToIndex = (index: number) => {
    const yPos = pickerItemHeight * index;
    setTimeout(() => {
      if (this.scrollRef) {
        this.scrollRef.current.scrollTo({ y: yPos });
      }
    }, 0);
  };
  onMomentumScrollBegin = () => {
    this.momentumStarted = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.momentumStarted = false;

    if (!this.isScrollTo && !this.momentumStarted && !this.dragStarted) {
      this.scrollFix(e);
    }
  };
  placeIcon = () => {
    const color = this.props.iconColor ? this.props.iconColor : 'gray';
    const size = this.props.iconSize ? this.props.iconSize : 30;
    if (this.props.isCustomIcon) {
      return (
        <View style={{ paddingLeft: 15 }}>
          <CustomIcon name={this.props.icon} size={size} color={color} />
        </View>
      );
    } else {
      return (
        <View style={{ paddingLeft: 15 }}>
          <Ionicons name={this.props.icon} size={size} color={color} />
        </View>
      );
    }
  };
  onTouch = (event: GestureResponderEvent) => {
    if (!this.momentumStarted && !this.dragStarted) {
      const index = Math.floor(
        (event.nativeEvent.locationY - 65) / pickerItemHeight
      );
      this.scrollToIndex(index);
    }
  };
  render() {
    return (
      <View style={styles.parentContainer}>
        <View
          style={[
            styles.container,
            { backgroundColor: this.state.backgroundColor }
          ]}
          onTouchEnd={this.scrollToState}
          onTouchStart={this.updateOpacity}
        >
          {this.props.icon && this.placeIcon()}
          <Text style={[styles.text, { textAlign: 'left', paddingLeft: 8 }]}>
            {this.props.label}
          </Text>
          <Text style={[styles.text, { textAlign: 'right', paddingRight: 30 }]}>
            {this.props.data[this.state.valueIndex]}
          </Text>
          <Ionicons
            size={30}
            name={'ios-arrow-down'}
            color={'black'}
            style={{ paddingTop: 5, paddingRight: 20 }}
          />
        </View>

        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          animationType="fade"
        >
          <View
            style={styles.modalBackground}
            onTouchEnd={this.setModalVisibility(false)}
          ></View>
          <View style={styles.modal}>
            <View style={styles.valueSelector}></View>

            <View style={styles.modalHeader}>
              <CustomButton
                width={60}
                backgroundColor="transparent"
                label="Done"
                fontColor="#147EFB"
                onPress={this.setModalVisibility(false)}
              />
            </View>
            <View style={styles.pickerScrollArea}>
              <ScrollView
                ref={this.scrollRef}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={this.onMomentumScrollEnd}
                onMomentumScrollBegin={this.onMomentumScrollBegin}
                onScrollBeginDrag={this.onScrollBeginDrag}
                onScrollEndDrag={this.onScrollEndDrag}
                onTouchEnd={this.onTouch}
              >
                <View
                  style={styles.scrollTopFiller}
                  pointerEvents="none"
                ></View>
                {this.props.data.map((value, ID) => (
                  <View key={ID} style={styles.pickerItem} pointerEvents="none">
                    <Text style={styles.pickerText}>{value}</Text>
                  </View>
                ))}
                <View
                  style={styles.scrollBottomFiller}
                  pointerEvents="none"
                ></View>
              </ScrollView>
              <LinearGradient
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  height: 65
                }}
                colors={[
                  'rgba(255, 255, 255, 1.0)',
                  'rgba(240, 240, 240, 0.6)'
                ]}
                pointerEvents={'none'}
              />

              <LinearGradient
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: 145
                }}
                colors={[
                  'rgba(245, 245, 245, 0.6)',
                  'rgba(255, 255, 255, 1.0)'
                ]}
                pointerEvents={'none'}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default ValueDropDown;

//https://github.com/yasemincidem/react-native-picker-scrollview credit to
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform
} from 'react-native';
import { Button } from './Button';
import { ScrollView } from 'react-native-gesture-handler';

const screenWidth = Math.round(Dimensions.get('window').width);
const backgroundColor = '#f6eded';
interface Props {
  label: string;
  updateValue: (value: string) => void;
  data: string[];
}
interface State {
  valueIndex: number;
  modalVisible: boolean;
}
const styles = StyleSheet.create({
  text: {
    flex: 3,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e5ebee',
    backgroundColor: 'white',
    width: screenWidth
  },
  selector: {
    position: 'absolute',
    top: 115,
    height: 50,
    borderColor: '#000',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: screenWidth,
    backgroundColor: 'white',
    zIndex: 0
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
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  modalHeader: {
    height: 50,
    borderColor: '#d3d3d3',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: backgroundColor
  },
  pickerItem: {
    height: 50,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  selectedItem: {
    height: 50,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  selectedText: {
    fontSize: 25,
    color: 'black'
  },
  pickerText: {
    fontSize: 25,
    color: '#d3d3d3'
  }
});
class ValueDropDown extends React.PureComponent<Props, State> {
  modalSide: number;
  translate: number;
  dragStarted: boolean;
  timer: NodeJS.Timeout;
  momentumStarted: boolean;
  isScrollTo: boolean;
  sview: any;
  constructor(props) {
    super(props);
    console.log('constructor');
    this.modalSide = 300;
    this.translate = (-1 * this.modalSide) / 2;
    this.state = {
      valueIndex: 0,
      modalVisible: false
    };
    this.sview = React.createRef();
  }
  scrollFix(e) {
    let verticalY = 0;
    const h = 50;
    if (e.nativeEvent.contentOffset) {
      verticalY = e.nativeEvent.contentOffset.y;
    }
    const selectedIndex = Math.round(verticalY / h);
    const verticalElem = selectedIndex * h;

    if (verticalElem !== verticalY) {
      if (Platform.OS === 'ios') {
        this.isScrollTo = true;
      }
      if (this.sview) {
        this.sview.current.scrollTo({ y: verticalElem });
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
  scrollToIndex = () => {
    const yPos = 50 * this.state.valueIndex;
    setTimeout(() => {
      if (this.sview) {
        this.sview.current.scrollTo({ y: yPos });
      }
    }, 0);
    this.setState({ modalVisible: true });
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
  itemSelected(value: number) {
    return value === this.state.valueIndex
      ? styles.selectedItem
      : styles.pickerItem;
  }
  isSelected(value: number) {
    return value === this.state.valueIndex
      ? styles.selectedText
      : styles.pickerText;
  }
  render() {
    return (
      <View>
        <View style={styles.container} onTouchStart={this.scrollToIndex}>
          <Text style={[styles.text, { textAlign: 'left', paddingLeft: 8 }]}>
            {this.props.label}
          </Text>
          <Text style={[styles.text, { textAlign: 'right', paddingRight: 20 }]}>
            {this.props.data[this.state.valueIndex]}
          </Text>
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
          <View
            style={[
              styles.modal,
              {
                height: this.modalSide,
                width: screenWidth,
                backgroundColor: backgroundColor
              }
            ]}
          >
            <View style={styles.selector}></View>
            <View style={[styles.modalHeader, { width: screenWidth }]}>
              <View style={{ paddingRight: 10 }}>
                <Button
                  width={100}
                  color="blue"
                  label="Done"
                  onPress={this.setModalVisibility(false)}
                />
              </View>
            </View>
            <View
              style={{ flex: 1, height: 200, backgroundColor: 'transparent' }}
            >
              <ScrollView
                ref={this.sview}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={this.onMomentumScrollEnd}
                onMomentumScrollBegin={this.onMomentumScrollBegin}
                onScrollBeginDrag={this.onScrollBeginDrag}
                onScrollEndDrag={this.onScrollEndDrag}
                bounces={false}
              >
                <View style={{ height: 65, width: screenWidth }}></View>
                {this.props.data.map((value, ID) => (
                  <View key={ID} style={this.itemSelected(ID)}>
                    <Text style={this.isSelected(ID)}>{value}</Text>
                  </View>
                ))}
                <View style={{ height: 140, width: screenWidth }}></View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default ValueDropDown;

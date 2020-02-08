/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  PanResponderInstance,
  PanResponder,
  StatusBar,
  Platform
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  NavigationEvents
} from 'react-navigation';
import LedNode from '../../components/LedNode';
import ColorPicker from '../../components/ColorPicker';
import * as Haptics from 'expo-haptics';
import styles from './LedGrid.style.';
import Loader from '../../components/Loader';
import { SettingsState } from '../../contexts/SettingsContext';
import SharedData from '../../sharedData';
interface Props {
  isFocused: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  screenProps: {
    billboardWidth: number;
    billboardHeight: number;
    ESPConn: boolean;
  };
}
interface State {
  width: number;
  height: number;
  loading: boolean;
}
class LedGrid extends React.PureComponent<Props, State> {
  sharedData: SharedData;
  NodeGrid = [];
  NodeRef = [];
  connectionRef: any;
  scrolling = true;
  NodeColor: string;
  _scrollRefOuter: any;
  _scrollRefInner: any;
  _scrollParentRef: any;
  _scroll: boolean;
  longPressTimeout: NodeJS.Timeout;
  shortDelay: number;
  shortPressTimeout: NodeJS.Timeout;
  _move: boolean;
  firstTouchX: number;
  firstTouchY: number;
  firstPosition: string;
  prevPosition: string;
  width: number;
  height: number;
  loading: boolean;
  screenWidth = Math.round(Dimensions.get('window').width);
  _panResponder: PanResponderInstance;

  constructor(props) {
    super(props);
    this.sharedData = SharedData.getInstance();
    this.state = {
      width: this.sharedData.width,
      height: this.sharedData.height,
      loading: false
    };
    this.loading = false;
    this._move = false;
    this.firstPosition = '';
    this.NodeColor = 'white';
    this.shortDelay = Platform.OS === 'ios' ? 15 : 25;
    this.prevPosition = '';
    this.width = this.sharedData.width;
    this.height = this.sharedData.height;
    this.NodeGrid = this.createNodeGrid(this.sharedData);
    this.NodeRef = this.createRefGrid(this.sharedData);
    this._scrollParentRef = React.createRef();
    this._scrollRefInner = React.createRef();
    this._scrollRefOuter = React.createRef();
    this.connectionRef = React.createRef();
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: event => {
        if (this._move) {
          clearTimeout(this.shortPressTimeout);
          clearTimeout(this.longPressTimeout);
          let xVal = Math.floor(event.nativeEvent.locationX / 25);
          let yVal = Math.floor(event.nativeEvent.locationY / 25);

          if (xVal >= this.sharedData.width) {
            xVal = this.sharedData.width - 1;
          } else if (xVal < 0) {
            xVal = 0;
          }
          if (yVal >= this.sharedData.height) {
            yVal = this.sharedData.height - 1;
          } else if (yVal < 0) {
            yVal = 0;
          }
          const newposition = xVal.toString() + ',' + yVal.toString();

          if (this.prevPosition !== newposition) {
            if (newposition !== this.firstPosition) {
              this.NodeRef[yVal][xVal].current.handleTouch();
            }
          }
          this.prevPosition = newposition;
        }
      },
      onStartShouldSetPanResponder: () => true,

      onPanResponderStart: event => {
        this.firstTouchX = Math.floor(event.nativeEvent.locationX / 25);
        this.firstTouchY = Math.floor(event.nativeEvent.locationY / 25);

        if (this.firstTouchX >= this.sharedData.width) {
          this.firstTouchX = this.sharedData.width - 1;
        } else if (this.firstTouchX < 0) {
          this.firstTouchX = 0;
        }
        if (this.firstTouchY >= this.sharedData.height) {
          this.firstTouchY = this.sharedData.height - 1;
        } else if (this.firstTouchY < 0) {
          this.firstTouchY = 0;
        }

        this.firstPosition =
          this.firstTouchX.toString() + ',' + this.firstTouchY.toString();

        this.shortPressTimeout = setTimeout(() => {
          this.NodeRef[this.firstTouchY][
            this.firstTouchX
          ].current.handleTouch();

          this.longPressTimeout = setTimeout(() => {
            this._move = true;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            this.setScrolls(false);
          }, 300);
        }, this.shortDelay);
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderRelease: () => {
        clearTimeout(this.shortPressTimeout);
        clearTimeout(this.longPressTimeout);
        this._move = false;
        this.setScrolls(true);
      },
      onPanResponderTerminate: () => {
        clearTimeout(this.shortPressTimeout);
        clearTimeout(this.longPressTimeout);
        this._move = false;
        this.setScrolls(true);
      }
    });
  }
  setScrolls(scroll: boolean) {
    this._scrollParentRef.current.setNativeProps({ scrollEnabled: scroll });
    this._scrollRefInner.current.setNativeProps({ scrollEnabled: scroll });
    this._scrollRefOuter.current.setNativeProps({ scrollEnabled: scroll });
  }
  onNodeUpdate = (row: number, col: number, color: string) => {
    this.NodeGrid[row][col] = color;
  };
  onLongPress(value: boolean): void {
    this.scrolling = value;
  }
  onPressOut(value: boolean): void {
    this.scrolling = value;
  }

  onColorChange = (color: string) => {
    this.NodeColor = color;
  };
  sendColor = () => {
    return this.NodeColor;
  };
  changeGridWidth(prevwidth, newwidth) {
    const height = this.height;
    if (newwidth < prevwidth) {
      let i = 0;
      for (i = 0; i < height; i++) {
        this.NodeGrid[i].splice(newwidth, prevwidth - newwidth);
        this.NodeRef[i].splice(newwidth, prevwidth - newwidth);
      }
    } else {
      let i = 0;
      let j = 0;
      for (i = 0; i < height; i++) {
        for (j = prevwidth; j < newwidth; j++) {
          this.NodeGrid[i].push('#000000');
          this.NodeRef[i].push(React.createRef());
        }
      }
    }
  }
  changeGridHeight(height, newheight) {
    const width = this.width;
    if (newheight < height) {
      this.NodeGrid.splice(newheight, height - newheight);
      this.NodeRef.splice(newheight, height - newheight);
    } else {
      for (let row = height; row < newheight; row++) {
        const newRow = [];
        const newRefRow = [];
        for (let col = 0; col < width; col++) {
          newRow.push('#000000');
          newRefRow.push(React.createRef());
        }
        this.NodeGrid.push(newRow);
        this.NodeRef.push(newRefRow);
      }
    }
  }
  createNodeGrid(size: SettingsState) {
    const grid = [];
    const height = size.height;
    const width = size.width;
    for (let row = 0; row < height; row++) {
      const currentRow = [];
      for (let col = 0; col < width; col++) {
        // currentRow.push(false);
        currentRow.push('#000000');
      }
      grid.push(currentRow);
    }
    return grid;
  }
  clearScreen = () => {
    this.NodeRef.map(row => {
      row.map(Node => {
        Node.current.resetColor();
      });
    });
  };

  createRefGrid(size: SettingsState) {
    const grid = [];
    const height = size.height;
    const width = size.width;

    for (let row = 0; row < height; row++) {
      const currentRow = [];
      for (let col = 0; col < width; col++) {
        currentRow.push(React.createRef());
      }
      grid.push(currentRow);
    }
    return grid;
  }
  onMenuTouch() {
    alert('Pressed Menu');
  }
  onPress = () => {
    this.props.navigation.openDrawer();
  };

  onEnter = () => {
    // Function call to tell the ESP32 to change State in StateMachine
    console.log('rendering ledgrid');
    if (
      this.width !== this.sharedData.width ||
      this.height !== this.sharedData.height
    ) {
      this.loading = true;
      this.setState({ loading: this.loading });
      setTimeout(() => {
        this.startUpdateProcess();
      }, 10);
    }
  };
  async UpdatePage() {
    if (this.height !== this.sharedData.height) {
      this.changeGridHeight(this.height, this.sharedData.height);
      this.height = this.sharedData.height;
    }
    if (this.width !== this.sharedData.width) {
      this.changeGridWidth(this.width, this.sharedData.width);
      this.width = this.sharedData.width;
    }
  }
  async startUpdateProcess() {
    await this.UpdatePage();
    this.loading = false;
    this.setState({ loading: false });
  }

  render() {
    const width = this.width * 25;
    let ID = '';
    return (
      <ScrollView ref={this._scrollParentRef}>
        <Loader loading={this.loading} />
        <StatusBar barStyle="light-content" />
        <NavigationEvents onDidFocus={this.onEnter} />
        <View style={styles.body} collapsable={false}>
          <View
            collapsable={false}
            style={{
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 1,
              width: this.screenWidth,
              height: this.screenWidth,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ScrollView
              ref={this._scrollRefOuter}
              overScrollMode={'auto'}
              nestedScrollEnabled={true}
              scrollEnabled={this._scroll}
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ScrollView
                ref={this._scrollRefInner}
                overScrollMode={'auto'}
                nestedScrollEnabled={true}
                scrollEnabled={this._scroll}
                horizontal={true}
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <View
                  {...this._panResponder.panHandlers}
                  collapsable={false}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    width: width,
                    flexWrap: 'wrap'
                  }}
                >
                  {this.NodeGrid.map((row, rowID) => {
                    return row.map((col: any, colID: number) => {
                      ID = rowID.toString() + ',' + colID.toString();
                      return (
                        <LedNode
                          ref={this.NodeRef[rowID][colID]}
                          key={ID}
                          color={this.sendColor}
                          onNodeUpdate={this.onNodeUpdate}
                          col={colID}
                          row={rowID}
                        />
                      );
                    });
                  })}
                </View>
              </ScrollView>
            </ScrollView>
          </View>
          <View
            collapsable={false}
            style={{
              alignItems: 'center',
              width: this.screenWidth,
              height: 300,
              backgroundColor: 'blue'
            }}
          >
            <ColorPicker
              onColorChange={this.onColorChange}
              clearScreen={this.clearScreen}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default LedGrid;

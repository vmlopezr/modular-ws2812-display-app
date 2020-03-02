/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  View,
  ScrollView,
  PanResponderInstance,
  PanResponder,
  GestureResponderEvent
} from 'react-native';
import LedNode from './LedNode';
import * as Haptics from 'expo-haptics';
import LocalStorage from '../../LocalStorage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { screenWidth } from '../GlobalStyles';

interface Props {
  updateLoading?(loading: boolean): void;
  width: number;
  height: number;
  NodeColor: string;
  LedColor: string;
}
type Size = {
  width: number;
  height: number;
};
export default class GridComponent extends React.Component<Props> {
  storage: LocalStorage;
  NodeGrid: string[];
  NodeRef: React.RefObject<LedNode>[];
  connectionRef: any;
  scrolling = true;
  _scrollRefOuter: any;
  _scrollRefInner: any;
  _scroll: boolean;
  longPressTimeout: NodeJS.Timeout;
  shortDelay: number;
  shortPressTimeout: NodeJS.Timeout;
  _move: boolean;
  _touch: boolean;
  firstTouchX: number;
  firstTouchY: number;
  firstPosition: string;
  prevPosition: string;
  prevWidth: number;
  prevHeight: number;
  changedGridSize: boolean;
  finishedReading: boolean;
  liveIndex: number;

  _panResponder: PanResponderInstance;

  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.state = {
      loading: false
    };
    this.changedGridSize = false;
    this._move = false;
    this._touch = false;
    this.firstPosition = '';
    this.shortDelay = 60;
    this.prevPosition = '';
    this.prevWidth = this.storage.width;
    this.prevHeight = this.storage.height;
    this.NodeGrid = this.createNodeGrid({
      width: this.props.width,
      height: this.props.height
    });
    this.NodeRef = this.createRefGrid({
      width: this.props.width,
      height: this.props.height
    });
    this._scrollRefInner = React.createRef();
    this._scrollRefOuter = React.createRef();
    this.finishedReading = false;
    this.liveIndex = 0;
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: event => {
        if (
          !(
            (this.props.height == 8 &&
              this.props.width == 8 &&
              (event.nativeEvent.pageY <= 157 ||
                event.nativeEvent.pageY >= 353 ||
                event.nativeEvent.pageX <= 107 ||
                event.nativeEvent.pageX >= 303)) ||
            (this.props.height == 8 &&
              (event.nativeEvent.pageY <= 157 ||
                event.nativeEvent.pageY >= 353)) ||
            (this.props.width == 8 &&
              (event.nativeEvent.pageX <= 107 ||
                event.nativeEvent.pageX >= 303))
          )
        ) {
          if (event.nativeEvent.pageY > 75 && event.nativeEvent.pageY < 435) {
            if (this._move) {
              clearTimeout(this.shortPressTimeout);
              clearTimeout(this.longPressTimeout);
              let xVal = Math.floor(event.nativeEvent.locationX / 25);
              let yVal =
                this.props.height -
                1 -
                Math.floor(event.nativeEvent.locationY / 25);

              if (xVal >= this.props.width) {
                xVal = this.props.width - 1;
              } else if (xVal < 0) {
                xVal = 0;
              }
              if (yVal >= this.props.height) {
                yVal = this.props.height - 1;
              } else if (yVal < 0) {
                yVal = 0;
              }
              const newposition = xVal.toString() + ',' + yVal.toString();

              if (this.prevPosition !== newposition) {
                if (newposition !== this.firstPosition) {
                  const index = yVal + this.props.height * xVal;
                  this.liveIndex = this.getDisplayIndex(xVal, yVal);
                  this.NodeRef[index].current.handleTouch();
                }
              }
              this.prevPosition = newposition;
            }
          }
        }
      },
      onStartShouldSetPanResponder: () => true,

      onPanResponderStart: event => {
        if (event.nativeEvent.touches.length === 1) {
          this.firstTouchY =
            this.props.height -
            1 -
            Math.floor(event.nativeEvent.locationY / 25);
          this.firstTouchX = Math.floor(event.nativeEvent.locationX / 25);
          const index = this.firstTouchY + this.props.height * this.firstTouchX;
          if (this.firstTouchX >= this.props.width) {
            this.firstTouchX = this.props.width - 1;
          } else if (this.firstTouchX < 0) {
            this.firstTouchX = 0;
          }
          if (this.firstTouchY >= this.props.height) {
            this.firstTouchY = this.props.height - 1;
          } else if (this.firstTouchY < 0) {
            this.firstTouchY = 0;
          }

          this.firstPosition =
            this.firstTouchX.toString() + ',' + this.firstTouchY.toString();

          this.shortPressTimeout = setTimeout(() => {
            // this._touch = true;
            this.liveIndex = this.getDisplayIndex(
              this.firstTouchX,
              this.firstTouchY
            );
            this.NodeRef[index].current.handleTouch();

            this.longPressTimeout = setTimeout(() => {
              this._move = true;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              this.setScrolls(false);
            }, 300);
          }, this.shortDelay);
        }
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
  liveInput = (color: string) => {
    if (this.storage.ESPConn) {
      const data = 'INPT' + this.liveIndex + ' ' + color.slice(1, 7);
      this.storage.socketInstance.send(data);
    }
  };
  getDisplayIndex = (x, y) => {
    const isCJMCU = this.storage.MatrixType === 'CJMCU-64' ? true : false;

    if (!isCJMCU && x % 2 === 1) {
      return (
        8 * (x % 8) +
        (7 - (y % 8)) +
        64 * Math.floor(x / 8) +
        this.props.width * 8 * Math.floor(y / 8)
      );
    } else {
      return (
        8 * (x % 8) +
        (y % 8) +
        64 * Math.floor(x / 8) +
        this.props.width * 8 * Math.floor(y / 8)
      );
    }
  };
  setScrolls(scroll: boolean) {
    this._scrollRefInner.current.setNativeProps({ scrollEnabled: scroll });
    this._scrollRefOuter.current.setNativeProps({ scrollEnabled: scroll });
  }

  onNodeUpdate = (index: number, color: string) => {
    this.NodeGrid[index] = color;
    this.liveInput(color);
  };
  onLongPress(value: boolean): void {
    this.scrolling = value;
  }
  onPressOut(value: boolean): void {
    this.scrolling = value;
  }

  sendColor = () => {
    return { NodeColor: this.props.NodeColor, LedColor: this.props.LedColor };
  };

  updateGridLength(height, width) {
    const newlength = height * width;
    const oldlength = this.prevHeight * this.prevWidth;

    if (newlength < oldlength) {
      this.NodeGrid.splice(newlength, oldlength - newlength);
      this.NodeRef.splice(newlength, oldlength - newlength);
    } else {
      for (let index = oldlength; index < newlength; index++) {
        this.NodeRef.push(React.createRef());
        this.NodeGrid.push('#000000');
      }
    }
  }
  createNodeGrid(size: Size) {
    const grid = [];
    const length = size.width * size.height;
    for (let object = 0; object < length; object++) {
      grid.push('#000000');
    }
    return grid;
  }

  createRefGrid(size: Size) {
    const grid = [];
    const length = size.width * size.height;
    for (let object = 0; object < length; object++) {
      grid.push(React.createRef());
    }
    return grid;
  }
  clearScreen = () => {
    this.NodeRef.map((node: React.RefObject<LedNode>) => {
      node.current.resetColor();
    });
    this.NodeGrid.fill('#000000', 0, this.NodeGrid.length);
    if (this.storage.ESPConn) {
      this.storage.socketInstance.send('CLRI');
    }
  };
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    ) {
      this.changedGridSize = true;
      setTimeout(() => {
        this.startUpdateProcess();
      }, 30);

      return true;
    } else if (this.changedGridSize) {
      this.changedGridSize = false;
      return true;
    } else if (this.finishedReading) {
      this.finishedReading = false;
      return true;
    }

    return false;
  }
  convertValue(value: string): string {
    const number = parseInt(value, 16);

    if (!number) {
      return '00';
    } else {
      return ('0' + Math.round((55 * number) / 254 + 200).toString(16)).slice(
        -2
      );
    }
  }
  processFileData(data: string) {
    const height = this.props.height;
    const width = this.props.width;
    const subheight = height / 8;
    const subwidth = width / 8;

    if (height > 8) {
      let count = 0;
      for (let i = 0; i < subheight; i++) {
        for (let j = 0; j < subwidth; j++) {
          for (let z = 0; z < 8; z++) {
            for (let c = 0; c < 8; c++) {
              const index = height * z + c + width * j * 8 + 8 * i;
              const color = '#' + data.slice(count * 6, (count + 1) * 6);
              this.NodeGrid[index] = color;
              this.NodeRef[index].current.updateColor(
                '#' +
                  this.convertValue(color.slice(1, 3)) +
                  this.convertValue(color.slice(3, 5)) +
                  this.convertValue(color.slice(5, 7))
              );
              count++;
            }
          }
        }
      }
    } else {
      let color = '';
      for (let i = 0; i < height * width; i++) {
        color = '#' + data.slice(i * 6, (i + 1) * 6);
        const newcolor =
          '#' +
          this.convertValue(color.slice(1, 3)) +
          this.convertValue(color.slice(3, 5)) +
          this.convertValue(color.slice(5, 7));
        this.NodeGrid[i] = color;
        this.NodeRef[i].current.updateColor(newcolor);
      }
    }
    this.finishedReading = true;
    this.props.updateLoading(false);
  }
  sendGridData(): string {
    const height = this.props.height;
    const width = this.props.width;
    const subheight = height / 8;
    const subwidth = width / 8;

    let data = '';
    let index = 0;
    if (height > 8) {
      for (let i = 0; i < subheight; i++) {
        for (let j = 0; j < subwidth; j++) {
          for (let z = 0; z < 8; z++) {
            for (let c = 0; c < 8; c++) {
              index = height * z + c + width * j * 8 + 8 * i;
              data = data + this.NodeGrid[index].slice(1, 7);
            }
            data = data + '\n';
          }
        }
      }
    } else {
      this.NodeGrid.map((value, index) => {
        if (index % 8 === 0 && index > 0) {
          data = data + '\n';
        }
        data = data + value.slice(1, 7);
      });
    }
    return data;
  }
  async UpdatePage() {
    if (
      this.prevHeight !== this.props.height ||
      this.prevWidth !== this.props.width
    ) {
      this.updateGridLength(this.props.height, this.props.width);
      this.prevHeight = this.props.height;
      this.prevWidth = this.props.width;
    }
  }
  async startUpdateProcess() {
    await this.UpdatePage();

    this.props.updateLoading(false);
  }
  render() {
    return (
      <ScrollView
        ref={this._scrollRefOuter}
        overScrollMode={'auto'}
        nestedScrollEnabled={true}
        scrollEnabled={this._scroll}
        maximumZoomScale={1.0}
        minimumZoomScale={0.25}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ScrollView
          maximumZoomScale={1.0}
          minimumZoomScale={0.25}
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
              flexDirection: 'column-reverse',
              width: this.props.width * 25,
              height: this.props.height * 25,
              flexWrap: 'wrap'
            }}
          >
            {this.NodeRef.map((nodeRef, index) => {
              return (
                <LedNode
                  ref={nodeRef}
                  key={index}
                  color={this.sendColor}
                  onNodeUpdate={this.onNodeUpdate}
                  index={index}
                  width={this.props.width}
                />
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
}

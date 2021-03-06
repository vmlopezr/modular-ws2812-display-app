/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  View,
  ScrollView,
  PanResponderInstance,
  PanResponder
} from 'react-native';
import LedNode from './LedNode';
import * as Haptics from 'expo-haptics';
import LocalStorage from '../../LocalStorage';

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
  // shortDelay: number;
  shortPressTimeout: NodeJS.Timeout;
  _move: boolean;
  _touch: boolean;
  firstTouch: string;
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
    this.firstTouch = '';
    // this.shortDelay = 60;
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

      // Allow dragging on the grid, after long press
      onPanResponderMove: (event, state) => {
        const { height, width } = this.props;
        const { pageY, locationX, locationY } = event.nativeEvent;

        // Allow the event to execute when the move/drag is in the grid area.
        if (pageY > 75 && pageY < 480) {
          if (this._move) {
            clearTimeout(this.shortPressTimeout);
            clearTimeout(this.longPressTimeout);

            // Calculate index of node. Each node is 25 px by 25 px
            let xVal = Math.floor(locationX / 25);
            let yVal = height - 1 - Math.floor(locationY / 25);

            // Check for boundaries of the grid
            if (xVal >= width) xVal = width - 1;
            else if (xVal < 0) xVal = 0;

            if (yVal >= height) yVal = height - 1;
            else if (yVal < 0) yVal = 0;

            // save current position
            const newposition = xVal.toString() + ',' + yVal.toString();

            if (this.prevPosition == newposition) return;

            if (newposition !== this.firstTouch) {
              const index = yVal + height * xVal;
              this.liveIndex = this.getDisplayIndex(xVal, yVal);
              this.NodeRef[index].current.handleTouch();
            }

            this.prevPosition = newposition;
          }
        }
      },
      onStartShouldSetPanResponder: () => true,

      onPanResponderStart: event => {
        const { locationY, locationX, touches } = event.nativeEvent;
        if (touches.length === 1) {
          const { height, width } = this.props;

          // Convert touch coordinates to index of node.
          let yPos = height - 1 - Math.floor(locationY / 25);
          let xPos = Math.floor(locationX / 25);
          const index = yPos + height * xPos;

          // Check for boundaries of the grid
          if (xPos >= width) xPos = width - 1;
          else if (xPos < 0) xPos = 0;

          if (yPos >= height) yPos = height - 1;
          else if (yPos < 0) yPos = 0;

          // load first touch coordinates for comparison with possible move coordinates later on
          this.firstTouch = xPos.toString() + ',' + yPos.toString();

          // this.shortPressTimeout = setTimeout(() => {
          this.liveIndex = this.getDisplayIndex(xPos, yPos);
          this.NodeRef[index].current.handleTouch();

          // On long press timeout allow dragging. This is controlled by onPanResponderMove
          this.longPressTimeout = setTimeout(() => {
            this._move = true;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            this.setScrolls(false);
          }, 300);
          // }, this.shortDelay);
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
  // Send live data to the ESP32
  liveInput = (color: string) => {
    if (this.storage.ESPConn) {
      const data = 'INPT' + this.liveIndex + ' ' + color.slice(1, 7);
      this.storage.socketInstance.send(data);
    }
  };
  getDisplayIndex = (x, y) => {
    const { MatrixType, width, height } = this.storage;
    // Calculate the index in the contiguous array based on the data signal
    // path of the matrix type used. See the settings screen for more help.
    if (MatrixType === 'WS-2812-8x8') {
      if (x % 2 === 1) {
        return (
          8 * (x % 8) +
          (7 - (y % 8)) +
          64 * Math.floor(x / 8) +
          width * 8 * Math.floor(y / 8)
        );
      } else {
        return (
          8 * (x % 8) +
          (y % 8) +
          64 * Math.floor(x / 8) +
          width * 8 * Math.floor(y / 8)
        );
      }
    } else if (MatrixType === 'CJMCU-64') {
      return (
        8 * (x % 8) +
        (y % 8) +
        64 * Math.floor(x / 8) +
        width * 8 * Math.floor(y / 8)
      );
    } else if (MatrixType === 'CUSTOM-CJMCU') {
      return y + height * x;
    } else if (MatrixType === 'CUSTOM-WS-2812') {
      if (x % 2 === 1) {
        return height - 1 - y + height * x;
      } else {
        return y + height * x;
      }
    }
  };

  // Disable or enable the scrolling for the grid
  setScrolls(scroll: boolean) {
    this._scrollRefInner.current.setNativeProps({ scrollEnabled: scroll });
    this._scrollRefOuter.current.setNativeProps({ scrollEnabled: scroll });
  }

  // Write the color of the touched node to the array.
  onNodeUpdate = (index: number, color: string) => {
    this.NodeGrid[index] = color;
    this.liveInput(color);
  };

  sendColor = () => {
    const { NodeColor, LedColor } = this.props;
    return { NodeColor: NodeColor, LedColor: LedColor };
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

  // Reset the grid color to black
  clearScreen = () => {
    this.NodeRef.map((node: React.RefObject<LedNode>) => {
      node.current.resetColor();
    });
    this.NodeGrid.fill('#000000', 0, this.NodeGrid.length);
    if (this.storage.ESPConn) this.storage.socketInstance.send('CLRI');
  };

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
  // Place the values based on LED Matrix type
  processFileData(data: string) {
    const mtype = this.storage.MatrixType;
    const height = this.props.height;
    const width = this.props.width;
    const subheight = height / 8;
    const subwidth = width / 8;
    if (mtype === 'CJMCU-64') {
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
    } else if (mtype === 'WS-2812-8x8') {
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
    } else if (mtype === 'CUSTOM-CJMCU') {
      let count = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const index = j + height * i;
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
    } else if (mtype === 'CUSTOM-WS-2812') {
      let count = 0;
      let index = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (i % 2 == 0) {
            index = j + height * i;
          } else {
            index = height - 1 - j + height * i;
          }
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

    this.finishedReading = true;
    this.props.updateLoading(false);
  }
  // Send grid data based on LED Matrix type
  sendGridData(): string {
    const height = this.props.height;
    const width = this.props.width;
    const subheight = height / 8;
    const subwidth = width / 8;
    const mtype = this.storage.MatrixType;
    let data = '';
    let index = 0;

    if (mtype === 'CJMCU-64') {
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
    } else if (mtype === 'WS-2812-8x8') {
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
    } else if (mtype === 'CUSTOM-CJMCU') {
      let index = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          index = j + i * width;
          data = data + this.NodeGrid[index].slice(1, 7);
        }
        data = data + '\n';
      }
    } else if (mtype === 'CUSTOM-WS-2812') {
      let index = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (i % 2 == 0) index = j + i * width;
          else index = height - 1 - j + i * width;
          data = data + this.NodeGrid[index].slice(1, 7);
        }
        data = data + '\n';
      }
    }

    return data;
  }

  // Update the grid size
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

  // disable the loading animation after completion
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

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
}
type Size = {
  width: number;
  height: number;
};
export default class GridComponent extends React.Component<Props> {
  storage: LocalStorage;
  NodeGrid = [];
  NodeRef = [];
  connectionRef: any;
  scrolling = true;
  _scrollRefOuter: any;
  _scrollRefInner: any;
  _scroll: boolean;
  longPressTimeout: NodeJS.Timeout;
  shortDelay: number;
  shortPressTimeout: NodeJS.Timeout;
  _move: boolean;
  firstTouchX: number;
  firstTouchY: number;
  firstPosition: string;
  prevPosition: string;
  prevWidth: number;
  prevHeight: number;
  changedGridSize: boolean;
  finishedReading: boolean;

  _panResponder: PanResponderInstance;

  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
    this.state = {
      loading: false
    };
    this.changedGridSize = false;
    this._move = false;
    this.firstPosition = '';
    this.shortDelay = 60;
    this.prevPosition = '';
    this.prevWidth = this.storage.width;
    this.prevHeight = this.storage.height;
    // this.NodeGrid = this.createNodeGrid(this.storage);
    // this.NodeRef = this.createRefGrid(this.storage);
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
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: event => {
        if (this._move) {
          clearTimeout(this.shortPressTimeout);
          clearTimeout(this.longPressTimeout);
          let xVal = Math.floor(event.nativeEvent.locationX / 25);
          let yVal = Math.floor(event.nativeEvent.locationY / 25);

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
              this.NodeRef[yVal][xVal].current.handleTouch();
              this.NodeGrid[yVal][xVal] = this.props.NodeColor;
            }
          }
          this.prevPosition = newposition;
        }
      },
      onStartShouldSetPanResponder: () => true,

      onPanResponderStart: event => {
        this.firstTouchX = Math.floor(event.nativeEvent.locationX / 25);
        this.firstTouchY = Math.floor(event.nativeEvent.locationY / 25);

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
          this.NodeRef[this.firstTouchY][
            this.firstTouchX
          ].current.handleTouch();
          this.NodeGrid[this.firstTouchY][
            this.firstTouchX
          ] = this.props.NodeColor;

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

  sendColor = () => {
    return this.props.NodeColor;
  };
  changeGridWidth(prevwidth, newwidth) {
    const height = this.prevHeight;
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
    const width = this.prevWidth;
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
  createNodeGrid(size: Size) {
    const grid = [];
    const height = size.height;
    const width = size.width;
    for (let row = 0; row < height; row++) {
      const currentRow = [];
      for (let col = 0; col < width; col++) {
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

  createRefGrid(size: Size) {
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
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    ) {
      this.changedGridSize = true;
      setTimeout(() => {
        this.startUpdateProcess();
      }, 10);

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
  processFileData(data: string) {
    const height = this.props.height;
    const width = this.props.width;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const color =
          '#' + data.slice((width * i + j) * 6, (width * i + j + 1) * 6);
        this.NodeGrid[i][j] = color;
        this.NodeRef[i][j].current.updateColor(color);
      }
    }
    this.finishedReading = true;
    this.props.updateLoading(false);
  }
  sendGridData(): string {
    const height = this.props.height;
    const width = this.props.width;
    let data = '';
    for (let i = 0; i < height; i++) {
      let row = '';
      for (let j = 0; j < width; j++) {
        row = row + this.NodeGrid[i][j].slice(1, 7);
      }
      row = row + '\n';
      data = data + row;
    }
    return data;
  }
  async UpdatePage() {
    if (this.prevHeight !== this.props.height) {
      this.changeGridHeight(this.prevHeight, this.props.height);
      this.prevHeight = this.props.height;
    }
    if (this.prevWidth !== this.props.width) {
      this.changeGridWidth(this.prevWidth, this.props.width);
      this.prevWidth = this.props.width;
    }
  }
  async startUpdateProcess() {
    await this.UpdatePage();

    this.props.updateLoading(false);
  }
  render() {
    const width = this.prevWidth * 25;
    let ID = '';
    return (
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
    );
  }
}

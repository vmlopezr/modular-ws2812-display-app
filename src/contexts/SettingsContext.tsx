/* eslint-disable no-undef */
import React, { createContext } from 'react';

export interface SettingsCtx {
  // state: SettingsState;
  data: SettingsActions;
}
export interface SettingsState {
  width: number;
  height: number;
}
interface SettingsActions {
  // widthUpdate: (width: number) => void;
  // heightUpdate: (height: number) => void;
  updateState(): Promise<string>;
  sizeUpdate: (width: number, height: number) => void;
  width: number;
  height: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SettingsContext = createContext<SettingsCtx>(null);
export const SettingsConsumer = SettingsContext.Consumer;

class SettingsContextProvider extends React.Component<{}, SettingsState> {
  width: number;
  height: number;

  constructor(props) {
    super(props);
    this.width = 10;
    this.height = 10;
    this.state = {
      width: 10,
      height: 10
    };
  }
  shouldComponentUpdate(nextState) {
    console.log('should settings context update?');
    if (
      nextState.width !== this.state.width ||
      nextState.height !== this.state.height
    ) {
      return true;
    }
    return false;
  }
  sizeUpdate = (width: number, height: number) => {
    console.log('updating sizes');
    this.width = width;
    this.height = height;
  };
  updateState = () => {
    console.log('updating state');

    return new Promise<string>(resolve => {
      this.setState({ width: this.width, height: this.height }, () =>
        resolve()
      );
    });
  };
  // widthUpdate = (width: number) => this.setState({ width: width });
  // heightUpdate = (height: number) => this.setState({ height: height });
  render() {
    console.log('rendering Settings context');
    return (
      <SettingsContext.Provider
        value={{
          // state: this.state,
          data: {
            // widthUpdate: this.widthUpdate,
            // heightUpdate: this.heightUpdate
            width: this.width,
            height: this.height,
            sizeUpdate: this.sizeUpdate,
            updateState: this.updateState
          }
        }}
      >
        {this.props.children}
      </SettingsContext.Provider>
    );
  }
}

export default SettingsContextProvider;

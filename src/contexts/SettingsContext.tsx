/* eslint-disable no-undef */
import React, { createContext } from 'react';

export interface SettingsCtx {
  data: SettingsActions;
}
export interface SettingsState {
  width: number;
  height: number;
}
interface SettingsActions {
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
    if (
      nextState.width !== this.state.width ||
      nextState.height !== this.state.height
    ) {
      return true;
    }
    return false;
  }
  sizeUpdate = (width: number, height: number) => {
    this.width = width;
    this.height = height;
  };
  updateState = () => {
    return new Promise<string>(resolve => {
      this.setState({ width: this.width, height: this.height }, () =>
        resolve()
      );
    });
  };
  render() {
    return (
      <SettingsContext.Provider
        value={{
          data: {
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

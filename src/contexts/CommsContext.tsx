import React, { createContext } from 'react';
import SharedData from '../sharedData';

export interface CommsCtx {
  state: CommsState;
  actions: CommsActions;
}
interface CommsState {
  ESPConn: boolean;
}
interface CommsActions {
  commsUpdate: (ESPComm: boolean) => void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CommsContext = createContext<CommsCtx>(null);
export const CommsConsumer = CommsContext.Consumer;

class CommsContextProvider extends React.Component<{}, CommsState> {
  sharedData: SharedData;
  state = {
    ESPConn: false
  };
  shouldComponentUpdate(nextState) {
    console.log('should comms context update?');
    if (nextState.ESPConn !== this.state.ESPConn) {
      return true;
    }
    return false;
  }
  subscribeSocketConnection = () => {
    if (!this.state.ESPConn) {
      this.sharedData.connectToServer();
      this.sharedData.socketInstance.addEventListener('close', () => {
        console.log('connection closed');
        this.setState({ ESPConn: false });
      });
      this.sharedData.socketInstance.addEventListener('open', () => {
        console.log('connection opened');
        this.setState({ ESPConn: true });
      });
    }
  };
  commsUpdate = (ESPConn: boolean) => this.setState({ ESPConn: ESPConn });
  render() {
    // console.log('rendering Comms context');
    return (
      <CommsContext.Provider
        value={{
          state: this.state,
          actions: {
            commsUpdate: this.commsUpdate
          }
        }}
      >
        {this.props.children}
      </CommsContext.Provider>
    );
  }
}

export default CommsContextProvider;

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
  reconnectESP: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CommsContext = createContext<CommsCtx>(null);
export const CommsConsumer = CommsContext.Consumer;

class CommsContextProvider extends React.PureComponent<{}, CommsState> {
  sharedData: SharedData;
  state = {
    ESPConn: false
  };
  constructor(props) {
    super(props);
    this.sharedData = SharedData.getInstance();
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
      this.sharedData.socketInstance.addEventListener('error', event => {
        console.log('error occurred with the websocket connection.');
        console.log(event);
      });
    }
  };
  render() {
    return (
      <CommsContext.Provider
        value={{
          state: this.state,
          actions: {
            reconnectESP: this.subscribeSocketConnection
          }
        }}
      >
        {this.props.children}
      </CommsContext.Provider>
    );
  }
}

export default CommsContextProvider;

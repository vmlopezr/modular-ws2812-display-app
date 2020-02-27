import React, { createContext } from 'react';
import LocalStorage from '../LocalStorage';

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
  storage: LocalStorage;
  state = {
    ESPConn: false
  };
  constructor(props) {
    super(props);
    this.storage = LocalStorage.getInstance();
  }
  subscribeSocketConnection = () => {
    if (!this.state.ESPConn) {
      this.storage.connectToServer();
      this.storage.socketInstance.addEventListener('close', () => {
        console.log('connection closed');
        this.storage.ESPConn = false;
        this.setState({ ESPConn: false });
      });
      this.storage.socketInstance.addEventListener('open', () => {
        console.log('connection opened');
        this.storage.ESPConn = true;
        this.setState({ ESPConn: true });
        //
        if (this.storage.ESPConn) {
          const data = 'size' + this.storage.height + ' ' + this.storage.width;
          // Update Size data on the ESP32
          this.storage.socketInstance.send(data);

          // Set ESP32 State Maching to Live Input State
          if (this.storage.focusedScreen === 'LedGrid') {
            this.storage.socketInstance.send('LIVE');
          }

          // Update Matrix Type on ESP32
          this.storage.socketInstance.send('TYPE' + this.storage.MatrixType);
        }
      });
      this.storage.socketInstance.addEventListener('error', () => {
        // When the connection attempt times out after 10 seconds
        // Alert the user. The close event runs after error.
        alert(
          'Warning: Could not connect to the ESP32. Verify that it is powered correctly and try again.'
        );
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

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
        this.storage.ESPConn = false;
        this.setState({ ESPConn: false });
      });
      this.storage.socketInstance.addEventListener('open', () => {
        this.storage.ESPConn = true;
        this.setState({ ESPConn: true });

        if (this.storage.ESPConn) {
          // Set ESP32 State Maching to Live Input State
          if (this.storage.focusedScreen === 'LedGrid') {
            this.storage.socketInstance.send('LIVE');
          } else if (this.storage.focusedScreen === 'Settings') {
            this.storage.socketInstance.send('SETT');
          }

          // Update Matrix Type on ESP32
          this.storage.socketInstance.send('TYPE' + this.storage.MatrixType);
        }
      });
      this.storage.socketInstance.addEventListener('error', () => {
        alert(
          'Warning: Could not connect to the ESP32. Verify that it is powered correctly and try again.'
        );
      });
      this.storage.socketInstance.addEventListener('message', this.onConnect);
    }
  };
  onConnect = (event: { data: string }) => {
    const data = event.data;

    if (data === 'REJECT') {
      this.setState({ ESPConn: false });
      this.storage.socketInstance.close();
      alert(
        'WARNING: Only one client can connect to the ESP32 Controller. Verify that the live connection is shut down.'
      );
    }
    this.storage.socketInstance.removeEventListener('message', this.onConnect);
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

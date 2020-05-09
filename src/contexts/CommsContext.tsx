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

//The context monitors the connection with the ESP32. Automatically updates
//The connection badge on the upper right header on connect/disconnect events.
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
      this.storage.socketInstance.addEventListener('close', this.onDisconnect);
      this.storage.socketInstance.addEventListener('open', this.onConnect);
      this.storage.socketInstance.addEventListener('error', () => {
        alert(
          'Warning: Could not connect to the ESP32, or the connection was lost.\nVerify that it is powered correctly and try again.'
        );
      });
    }
  };
  onDisconnect = () => {
    this.storage.ESPConn = false;
    this.setState({ ESPConn: false });
    alert('Connection with the ESP32 is closed.');
  };
  onConnect = () => {
    const { focusedScreen, socketInstance } = this.storage;
    this.storage.ESPConn = true;
    this.setState({ ESPConn: true });

    if (!this.storage.ESPConn) return;
    // Set ESP32 State to the active screen
    if (focusedScreen === 'LedGrid') socketInstance.send('LIVE');
    else if (focusedScreen === 'Settings') socketInstance.send('SETT');
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

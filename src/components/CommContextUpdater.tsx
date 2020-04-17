import React from 'react';
import { CommsContext } from '../contexts/CommsContext';
import { View } from 'react-native';

class CommContextUpdater extends React.PureComponent<{}, {}> {
  static contextType = CommsContext;
  context!: React.ContextType<typeof CommsContext>;
  constructor(props) {
    super(props);
  }
  restartConnection() {
    this.context.actions.reconnectESP();
  }
  render() {
    return <View></View>;
  }
}

export default CommContextUpdater;

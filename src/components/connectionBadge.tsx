import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommsContext } from '../contexts/CommsContext';

interface State {
  ESPConn: boolean;
}
// interface Props {
//   ESPConn: boolean;
// }
class ConnectionBadge extends React.PureComponent<{}, State> {
  static contextType = CommsContext;
  context!: React.ContextType<typeof CommsContext>;

  label: string;
  iconColor: string;

  constructor(props) {
    super(props);
    this.state = {
      ESPConn: false
    };
    this.label = 'OFFLINE';
    this.iconColor = 'tomato';
  }

  updateState(ESPConn) {
    if (ESPConn) {
      this.label = 'ONLINE';
      this.iconColor = 'green';
    } else {
      this.label = 'OFFLINE';
      this.iconColor = 'tomato';
    }
    this.setState({ ESPConn: ESPConn });
  }
  render() {
    // console.log('rendering connection badge');
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          alignSelf: 'flex-end'
        }}
      >
        <Ionicons
          style={{ paddingBottom: 0, margin: 0 }}
          name={'ios-cloud'}
          size={20}
          color={this.iconColor}
        />
        <Text
          style={{
            fontSize: 15,
            color: this.iconColor,
            fontWeight: 'bold',
            paddingTop: 0,
            margin: 0
          }}
        >
          {this.label}
        </Text>
      </View>
    );
  }
}
export default ConnectionBadge;

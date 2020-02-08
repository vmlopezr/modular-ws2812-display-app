import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import styles from './PreviewScreen.style';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  isFocused: boolean;
  count: number;
}

class PreviewScreen extends React.PureComponent<Props, State> {
  connectionRef: any;
  constructor(props) {
    super(props);
    this.connectionRef = React.createRef();
    this.state = {
      isFocused: false,
      count: 0
    };
  }
  onMenuTouch() {
    alert('Pressed the Menu Button');
  }
  updateCount = (): void => {
    const newcount = this.state.count + 1;
    this.setState({ count: newcount });
  };
  onPress = () => {
    this.props.navigation.openDrawer();
  };
  render() {
    return (
      <View style={styles.page}>
        <StatusBar barStyle="light-content" />
        <View style={styles.body}>
          <View>
            <Text>{this.state.count}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.updateCount}>
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Update Count
            </Text>
          </TouchableOpacity>
          <Text>Preview Page</Text>
        </View>
      </View>
    );
  }
}
export default PreviewScreen;

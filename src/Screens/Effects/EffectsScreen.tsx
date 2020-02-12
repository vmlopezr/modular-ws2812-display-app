import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './EffectsScreen.style';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView
} from 'react-navigation';
import GlobalStyles from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  isFocused: boolean;
  count: number;
}

class EffectsScreen extends React.PureComponent<Props, State> {
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
    this.props.navigation.toggleDrawer();
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <AppHeader title="Effects" navigation={this.props.navigation} />
        <View style={styles.body}>
          <View>
            <Text>{this.state.count}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={this.updateCount}>
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Update Count
            </Text>
          </TouchableOpacity>
          <Text>Effects Page</Text>
        </View>
      </SafeAreaView>
    );
  }
}
export default EffectsScreen;

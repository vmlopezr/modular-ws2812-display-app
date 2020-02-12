import React from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import styles from './PreviewScreen.style';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView
} from 'react-navigation';
import GlobalStyles from '../GlobalStyles';
import ConnectionBadge from '../../components/connectionBadge';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
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
    this.props.navigation.toggleDrawer();
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1, width: '100%' }}
        enabled={true}
        keyboardVerticalOffset={100}
      > */}
        {/* <View style={GlobalStyles.header}>
          <StatusBar barStyle="light-content" />
          <View style={{ width: 50 }}>
            <Ionicons
              name="md-menu"
              onPress={this.onPress}
              size={25}
              style={{ paddingLeft: 10 }}
              color={'#fff'}
            />
          </View>
          <Text style={styles.title}>Preview</Text>

          <View>
            <ConnectionBadge />
          </View>
        </View> */}
        <AppHeader title="Preview" navigation={this.props.navigation} />

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
      </SafeAreaView>
    );
  }
}
export default PreviewScreen;

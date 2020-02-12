import React from 'react';
import { View, Text, StatusBar, StyleSheet, Keyboard } from 'react-native';
import GlobalStyles from '../Screens/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import ConnectionBadge from './connectionBadge';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';

interface Props {
  title: string;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
const styles = StyleSheet.create({
  title: {
    flex: 3,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  }
});
const onPress = navigation => () => {
  Keyboard.dismiss();
  navigation.toggleDrawer();
};
const Header = (props: Props) => {
  return (
    <View style={GlobalStyles.header}>
      <StatusBar barStyle="light-content" />
      <View style={{ width: 50, flex: 1 }}>
        <Ionicons
          name="md-menu"
          onPress={onPress(props.navigation)}
          size={25}
          style={{ paddingLeft: 10 }}
          color={'#fff'}
        />
      </View>

      <Text style={styles.title}>{props.title}</Text>
      <View style={{ paddingRight: 5, flex: 1 }}>
        <ConnectionBadge />
      </View>
    </View>
  );
};

export default Header;

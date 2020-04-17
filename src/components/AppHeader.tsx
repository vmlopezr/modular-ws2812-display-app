import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Keyboard,
  TouchableOpacity
} from 'react-native';
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
  backButton?: boolean;
  backRoute?: string;
}
const styles = StyleSheet.create({
  titleContainer: {
    flex: 3,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  }
});
const onPress = navigation => () => {
  Keyboard.dismiss();
  navigation.toggleDrawer();
};
const onBackPress = (props: Props) => () => {
  props.navigation.navigate(props.backRoute ? props.backRoute : 'Settings');
};
const renderIcon = (props: Props): JSX.Element => {
  const { backButton } = props;
  if (backButton) {
    return (
      <TouchableOpacity
        onPress={onBackPress(props)}
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Ionicons
          name="ios-arrow-back"
          size={35}
          style={{ paddingLeft: 10, paddingRight: 10 }}
          color={'#fff'}
        />
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          {'Back'}
        </Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress(props.navigation)}
        style={{
          width: 50,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        <Ionicons
          name="md-menu"
          size={35}
          style={{ paddingLeft: 10 }}
          color={'#fff'}
        />
      </TouchableOpacity>
    );
  }
};
const Header = (props: Props) => {
  return (
    <View style={GlobalStyles.header}>
      <StatusBar barStyle="light-content" />
      {renderIcon(props)}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View style={{ paddingRight: 5, flex: 1 }}>
        <ConnectionBadge />
      </View>
    </View>
  );
};

export default Header;

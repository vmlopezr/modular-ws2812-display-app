import React from 'react';
import { View, Text } from 'react-native';
import styles from './SideMenuHeading.style';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { NavigationDrawerState } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';

type Navigation = NavigationScreenProp<NavigationDrawerState, NavigationParams>;
interface Props {
  navigation: Navigation;
  route: string;
  activeRoute: string;
  navigateTo: (route: string) => void;
  icon: string;
  label: string;
}
const navigateTo = (props: Props) => () => {
  props.navigateTo(props.route);
};
const backgroundColor = (props: Props) => {
  return props.activeRoute !== props.route ? 'white' : '#e5ebee';
};
const labelColor = (props: Props) => {
  return props.activeRoute === props.route ? '#48a5f1' : 'black';
};
const SideMenuHeading = (props: Props) => {
  return (
    <View
      style={[
        styles.sectionHeadingStyle,
        { backgroundColor: backgroundColor(props) }
      ]}
      collapsable={false}
      onTouchEnd={navigateTo(props)}
    >
      <Ionicons
        style={{ margin: 0 }}
        name={props.icon}
        size={30}
        color={labelColor(props)}
      />
      <Text style={[styles.navItemStyle, { color: labelColor(props) }]}>
        {props.label}
      </Text>
    </View>
  );
};
export default SideMenuHeading;

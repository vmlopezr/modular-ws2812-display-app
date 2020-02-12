/* eslint-disable react/display-name */
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  createDrawerNavigator,
  DrawerContentComponentProps
} from 'react-navigation-drawer';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Home from './Screens/Home/HomeScreen';
import Settings from './Screens/Settings/Settings';
import MessageScreen from './Screens/live-input/MessageScreen';
import LedGrid from './Screens/led-grid/LedGrid';
import { createAppContainer } from 'react-navigation';
import { Dimensions } from 'react-native';
import SideMenu from './Screens/SideMenu';
import EffectsScreen from './Screens/Effects/EffectsScreen';
import PreviewScreen from './Screens/Preview/PreviewScreen';

const defaultScreen = 'Type';
export type tabBarIconType = {
  focused: boolean;
  tintColor: string;
  horizontal?: boolean;
};
const DashboardTab = createBottomTabNavigator(
  {
    Draw: {
      screen: LedGrid,
      navigationOptions: () => ({
        tabBarIcon: (options: tabBarIconType) => {
          const iconName = `${options.focused ? 'ios-create' : 'md-create'}`;
          return (
            <Ionicons name={iconName} size={25} color={options.tintColor} />
          );
        }
      })
    },
    Home: {
      screen: Home,
      navigationOptions: () => ({
        tabBarIcon: (options: tabBarIconType) => {
          const iconName = `${options.focused ? 'ios-home' : 'md-home'}`;
          return (
            <Ionicons name={iconName} size={25} color={options.tintColor} />
          );
        }
      })
    },
    Type: {
      screen: MessageScreen,
      navigationOptions: () => ({
        drawerLabel: () => null,
        tabBarIcon: (options: tabBarIconType) => {
          const iconName = `${options.focused ? 'md-laptop' : 'ios-laptop'}`;
          return (
            <Ionicons name={iconName} size={25} color={options.tintColor} />
          );
        }
      })
    }
  },
  {
    initialRouteName: defaultScreen,
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      keyboardHidesTabBar: true
    },
    navigationOptions: {
      headerShown: false
    }
  }
);

const MainNavigator = createDrawerNavigator(
  {
    Settings: Settings,
    Dashboard: DashboardTab,
    Effects: EffectsScreen,
    Preview: PreviewScreen
  },

  {
    initialRouteName: 'Dashboard',
    contentComponent: (
      props: React.PropsWithChildren<DrawerContentComponentProps>
    ) => <SideMenu {...props} defaultScreen={defaultScreen} />,
    drawerWidth: Dimensions.get('window').width - 100
  }
);

export default createAppContainer(MainNavigator);

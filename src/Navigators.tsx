/* eslint-disable react/display-name */
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Screens/Home/HomeScreen';
import Settings from './Screens/Settings/Settings';
import MessageScreen from './Screens/live-input/MessageScreen';
import LedGrid from './Screens/led-grid/LedGrid';
import { createAppContainer } from 'react-navigation';
import ConnectionBadge from './components/connectionBadge';
import SideMenu from './Screens/SideMenu';

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
import { View } from 'react-native';
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

const DashboardTab = createBottomTabNavigator(
  {
    LedGrid: {
      screen: LedGrid,
      navigationOptions: () => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = `${focused ? 'ios-keypad' : 'md-keypad'}`;
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
      })
    },
    Home: {
      screen: Home,
      navigationOptions: () => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = `${focused ? 'ios-home' : 'md-home'}`;
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
      })
    },
    Message: {
      screen: MessageScreen,
      navigationOptions: () => ({
        drawerLabel: () => null,
        tabBarIcon: ({ focused, tintColor }) => {
          const iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
      })
    }
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    },
    navigationOptions: {
      headerShown: false
    }
  }
);

function getRouteName(navigation: Navigation): string {
  if (!navigation.state.index) {
    return 'Settings';
  } else {
    const index = navigation.state.routes[1].index;
    return navigation.state.routes[1].routes[index].routeName;
  }
}

const DrawerNavigator = createDrawerNavigator(
  {
    Settings: Settings,
    Dashboard: DashboardTab
  },

  {
    contentComponent: props => <SideMenu {...props} />,
    navigationOptions: ({ navigation }) => {
      const routeName = getRouteName(navigation);
      return {
        headerTitle: routeName,
        headerTitleStyle: {
          fontWeight: 'bold'
        },
        headerStyle: {
          backgroundColor: '#777'
        },
        headerTintColor: '#fff',
        headerLeft: () => (
          <Ionicons
            name="md-menu"
            onPress={() => navigation.openDrawer()}
            size={25}
            style={{ paddingLeft: 10 }}
            color={'#fff'}
          />
        ),
        headerRight: () => (
          <View style={{ paddingRight: 10 }}>
            <ConnectionBadge />
          </View>
        )
      };
    }
  }
);

const MainNavigator = createStackNavigator({
  App: DrawerNavigator
});

export default createAppContainer(MainNavigator);

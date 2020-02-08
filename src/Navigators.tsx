/* eslint-disable react/display-name */
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  createDrawerNavigator,
  DrawerContentComponentProps
} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Screens/Home/HomeScreen';
import Settings from './Screens/Settings/Settings';
import MessageScreen from './Screens/live-input/MessageScreen';
import LedGrid from './Screens/led-grid/LedGrid';
import { createAppContainer, NavigationRoute } from 'react-navigation';
import { Dimensions, Keyboard } from 'react-native';
import ConnectionBadge from './components/connectionBadge';
import SideMenu from './Screens/SideMenu';

import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
import { View } from 'react-native';
import EffectsScreen from './Screens/Effects/EffectsScreen';
import PreviewScreen from './Screens/Preview/PreviewScreen';
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;
type DrawerNavigation = NavigationScreenProp<
  NavigationRoute<NavigationParams>,
  NavigationParams
>;
const defaultScreen = 'Type';
type tabBarIconType = {
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
      inactiveTintColor: 'gray'
    },
    navigationOptions: {
      headerShown: false
    }
  }
);

function getRouteName(navigation: Navigation): string {
  if (navigation.state.index != 1) {
    const index = navigation.state.index;
    return navigation.state.routes[index].routeName;
  } else {
    const index = navigation.state.routes[1].index;
    return navigation.state.routes[1].routes[index].routeName;
  }
}
const onPress = (navigation: DrawerNavigation) => () => {
  Keyboard.dismiss();
  navigation.toggleDrawer();
};
const DrawerNavigator = createDrawerNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Test'
      }
    },
    Dashboard: DashboardTab,
    Effects: EffectsScreen,
    Preview: PreviewScreen
  },

  {
    initialRouteName: 'Dashboard',
    contentComponent: (
      props: React.PropsWithChildren<DrawerContentComponentProps>
    ) => <SideMenu {...props} defaultScreen={defaultScreen} />,
    drawerWidth: Dimensions.get('window').width - 130,
    navigationOptions: ({ navigation }) => {
      const routeName = getRouteName(navigation);
      return {
        gestureEnabled: false,
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
            onPress={onPress(navigation)}
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

const MainNavigator = createStackNavigator(
  {
    App: {
      screen: DrawerNavigator,
      navigationOptions: {
        gestureEnabled: false
      }
    }
  },
  {
    navigationOptions: {
      gestureEnabled: false
    }
  }
);

export default createAppContainer(MainNavigator);

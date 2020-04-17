/* eslint-disable react/display-name */
import {
  createDrawerNavigator,
  DrawerContentComponentProps
} from 'react-navigation-drawer';
import React from 'react';
import Home from './Screens/Home/HomeScreen';
import Settings from './Screens/Settings/Settings';
import LedGrid from './Screens/led-grid/LedGrid';
import { createAppContainer } from 'react-navigation';
import { Dimensions } from 'react-native';
import SideMenu from './Screens/SideMenu';
import AnimationScreen from './Screens/Animations/AnimationScreen';
import DefaultScreen from './Screens/Default/DefaultScreen';
import MatrixTypeScreen from './Screens/MatrixType/MatrixType';
const defaultScreen = 'Settings';

const MainNavigator = createDrawerNavigator(
  {
    Settings: Settings,
    MatrixType: MatrixTypeScreen,
    Draw: LedGrid,
    Home: Home,
    Animations: AnimationScreen,
    Default: DefaultScreen
  },

  {
    initialRouteName: defaultScreen,
    contentComponent: (
      props: React.PropsWithChildren<DrawerContentComponentProps>
    ) => <SideMenu {...props} defaultScreen={defaultScreen} />,
    drawerWidth: Dimensions.get('window').width - 100
  }
);

export default createAppContainer(MainNavigator);

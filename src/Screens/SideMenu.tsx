import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  NavigationActions,
  NavigationScreenProp,
  NavigationParams,
  NavigationRoute
} from 'react-navigation';
import { NavigationDrawerState } from 'react-navigation-drawer';
import SideMenuHeading from './SideMenuHeading';
import styles from './SideMenu.style';
import { ThemedColor } from 'react-navigation-tabs/lib/typescript/src/types';
//https://expo.github.io/vector-icons/
import LocalStorage from '../LocalStorage';
interface Props {
  navigation: Navigation;
  items: NavigationRoute[];
  activeItemKey?: string | null;
  activeTintColor?: string | ThemedColor;
  activeBackgroundColor?: string | ThemedColor;
  inactiveTintColor?: string | ThemedColor;
  inactiveBackgroundColor?: string | ThemedColor;
  defaultScreen: string;
}
type Navigation = NavigationScreenProp<NavigationDrawerState, NavigationParams>;

class SideMenu extends React.PureComponent<Props> {
  activeRoute: string;
  storage: LocalStorage;
  constructor(props) {
    super(props);
    this.activeRoute = this.props.defaultScreen;
    this.storage = LocalStorage.getInstance();
  }
  navigateToScreen = route => {
    if (route == 'Default' && !this.storage.ESPConn) {
      this.props.navigation.closeDrawer();
      alert('Warning: Must have an active connection with the ESP32.');
    } else {
      if (route !== this.getActiveRoute()) {
        if (
          route !== 'Draw' &&
          route !== 'Default' &&
          this.getActiveRoute() === 'Settings'
        ) {
          if (this.storage.ESPConn) this.storage.socketInstance.send('STLI');
        } else if (
          route !== 'Draw' &&
          route !== 'Settings' &&
          this.getActiveRoute() === 'Default'
        ) {
          if (this.storage.ESPConn) this.storage.socketInstance.send('STLI');
        }
        const navigateAction = NavigationActions.navigate({
          routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
      } else {
        this.props.navigation.closeDrawer();
      }
    }
  };
  getActiveRoute(): string {
    if (this.props.activeItemKey === 'Dashboard') {
      const index = this.props.items[1].index;
      return this.props.items[1].routes[index].routeName;
    } else {
      return this.props.activeItemKey;
    }
  }
  render() {
    const activeRoute = this.getActiveRoute();
    return (
      <View style={styles.container} collapsable={false}>
        <ScrollView>
          <View style={styles.divider}></View>
          <SideMenuHeading
            navigation={this.props.navigation}
            label="Home"
            route="Home"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
            icon="ios-home"
          />
          <SideMenuHeading
            navigation={this.props.navigation}
            label="Draw on Matrix"
            route="Draw"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
            icon="ios-create"
          />
          <View style={styles.divider}></View>
          <SideMenuHeading
            navigation={this.props.navigation}
            label="View Animation"
            route="Animations"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
            icon="ios-color-wand"
          />
          <SideMenuHeading
            navigation={this.props.navigation}
            label="Set Display"
            route="Default"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
            icon="ios-desktop"
          />
          <View style={styles.divider}></View>
          <SideMenuHeading
            navigation={this.props.navigation}
            label="Settings"
            route="Settings"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
            icon="ios-settings"
          />
          {/* <SideMenuHeading
            navigation={this.props.navigation}
            label="Matrix Type Help"
            route="MatrixType"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
            icon="ios-settings"
          /> */}
          <View style={styles.divider}></View>
        </ScrollView>
      </View>
    );
  }
}
export default SideMenu;

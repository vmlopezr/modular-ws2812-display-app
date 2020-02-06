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
interface Props {
  navigation: Navigation;
  items: NavigationRoute[];
  activeItemKey?: string | null;
  activeTintColor?: string | ThemedColor;
  activeBackgroundColor?: string | ThemedColor;
  inactiveTintColor?: string | ThemedColor;
  inactiveBackgroundColor?: string | ThemedColor;
}
type Navigation = NavigationScreenProp<NavigationDrawerState, NavigationParams>;

class SideMenu extends React.Component<Props> {
  navigateToScreen = route => {
    if (route !== this.getActiveRoute()) {
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
    } else {
      this.props.navigation.closeDrawer();
    }
  };
  shouldComponentUpdate() {
    return true;
  }
  getActiveRoute(): string {
    if (this.props.activeItemKey === 'Settings') {
      return 'Settings';
    } else {
      const index = this.props.items[1].index;
      return this.props.items[1].routes[index].routeName;
    }
  }
  render() {
    const activeRoute = this.getActiveRoute();
    return (
      <View style={styles.container}>
        <ScrollView>
          <SideMenuHeading
            navigation={this.props.navigation}
            route="Settings"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
          />
          <SideMenuHeading
            navigation={this.props.navigation}
            route="Home"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
          />
          <SideMenuHeading
            navigation={this.props.navigation}
            route="LedGrid"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
          />
          <SideMenuHeading
            navigation={this.props.navigation}
            route="Message"
            activeRoute={activeRoute}
            navigateTo={this.navigateToScreen}
          />
        </ScrollView>
      </View>
    );
  }
}
export default SideMenu;

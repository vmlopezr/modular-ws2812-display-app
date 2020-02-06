import React from 'react';
import { View, Text } from 'react-native';
import styles from './SideMenuHeading.style';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { NavigationDrawerState } from 'react-navigation-drawer';
interface Props {
  navigation: Navigation;
  route: string;
  activeRoute: string;
  navigateTo(route: string): void;
}

type Navigation = NavigationScreenProp<NavigationDrawerState, NavigationParams>;

class SideMenuHeading extends React.PureComponent<Props> {
  activeScreen: string;
  constructor(props) {
    super(props);
    this.activeScreen = this.props.activeRoute;
  }
  // shouldComponentUpdate(nextProp) {
  //   if (this.activeScreen !==) {
  //     return true;
  //   }
  //   return false;
  // }
  fontColor(): string {
    if (this.props.activeRoute === this.props.route) {
      return '#29c7ac';
    } else {
      return 'gray';
    }
  }
  navigate = () => {
    this.activeScreen = this.props.route;
    this.props.navigateTo(this.props.route);
  };
  render() {
    console.log('updating heading: ' + this.props.route);
    return (
      <View>
        <View style={styles.navSectionStyle}>
          <Text
            style={[styles.navItemStyle, { color: this.fontColor() }]}
            onPress={this.navigate}
          >
            {this.props.route}
          </Text>
        </View>
      </View>
    );
  }
}
export default SideMenuHeading;

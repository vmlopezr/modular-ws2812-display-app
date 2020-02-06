import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  NavigationActions,
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
import SideMenuHeading from './SideMenuHeading';
import styles from './SideMenu.style';
interface Props {
  navigation: Navigation;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

class SideMenu extends React.Component<Props> {
  // navigateToScreen = route => () => {
  //   const navigateAction = NavigationActions.navigate({
  //     routeName: route
  //   });
  //   this.props.navigation.dispatch(navigateAction);
  // };
  shouldComponentUpdate(nextProps) {
    // console.log(nextProps);
    // console.log('current props');
    // console.log(this.props);
    return false;
  }
  render() {
    // console.log('rendering SideMenu');
    // console.log(this.props.navigation.state);
    return (
      <View style={styles.container}>
        <ScrollView>
          <SideMenuHeading {...this.props} route="Settings" />
          <SideMenuHeading {...this.props} route="Dashboard" />
          <SideMenuHeading {...this.props} route="Home" />
          <SideMenuHeading {...this.props} route="LedGrid" />
          <SideMenuHeading {...this.props} route="Message" />
        </ScrollView>
      </View>
    );
  }
}
export default SideMenu;

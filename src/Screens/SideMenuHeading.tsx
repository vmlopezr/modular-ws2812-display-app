import React from 'react';
import { View, Text } from 'react-native';
import styles from './SideMenuHeading.style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
  NavigationActions
} from 'react-navigation';
interface Props {
  navigation: Navigation;
  route: string;
}
interface State {
  activated: boolean;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

class SideMenuHeading extends React.Component<Props, State> {
  fontColor: string;
  navigateToScreen = route => () => {
    this.updateColor();
    this.setState({ activated: true });
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  };
  constructor(props) {
    super(props);
    this.fontColor = 'gray';
    this.state = {
      activated: false
    };
  }
  shouldComponentUpdate(nextState) {
    if (nextState.activated !== this.state.activated) {
      return true;
    }
    return false;
  }
  updateColor() {
    if (this.state.activated) {
      this.fontColor = 'blue';
    } else {
      this.fontColor = 'gray';
    }
  }
  render() {
    console.log(this.props.route);
    return (
      <View>
        <View style={styles.navSectionStyle}>
          <Text
            style={[styles.navItemStyle, { color: this.fontColor }]}
            onPress={this.navigateToScreen(this.props.route)}
          >
            {this.props.route}
          </Text>
        </View>
      </View>
    );
  }
}
export default SideMenuHeading;

import React from 'react';
import MainNavigator from './src/Navigators';
import SettingsContextProvider from './src/contexts/SettingsContext';
import CommsContextProvider from './src/contexts/CommsContext';
import { BackHandler } from 'react-native';
export default class App extends React.PureComponent {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }
  render() {
    return (
      <SettingsContextProvider>
        <CommsContextProvider>
          <MainNavigator />
        </CommsContextProvider>
      </SettingsContextProvider>
    );
  }
}
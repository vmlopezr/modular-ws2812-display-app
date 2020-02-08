import React from 'react';
import { View, TextInput, StatusBar } from 'react-native';
import styles from './HomeScreen.style.';
import SharedData from '../../sharedData';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
import { Button } from '../../components/Button';
import CommContextUpdater from '../../components/CommContextUpdater';
interface Props {
  isFocused: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  width: number;
  height: number;
}

class HomeScreen extends React.Component<Props, State> {
  width: number;
  height: number;
  sharedData: SharedData;
  filename: string;
  updaterRef: any;
  data: string;
  constructor(props) {
    super(props);
    this.sharedData = SharedData.getInstance();
    this.width = this.sharedData.width;
    this.height = this.sharedData.height;
    this.updaterRef = React.createRef();
    this.data = ' ';
  }

  handleFilenameChange(filename: string): void {
    this.filename = filename;
  }
  printData = event => {
    console.log(event.data);
    this.sharedData.socketInstance.removeEventListener(
      'message',
      this.printData
    );
  };
  readData = (event: { data: string }) => {
    if (event.data === 'EX1T') {
      this.sharedData.socketInstance.removeEventListener(
        'message',
        this.readData
      );
      console.log('finished reading');
    } else {
      console.log(event.data);
      console.log(typeof event.data);
      this.data = event.data;
      console.log(this.data);
    }
  };
  onDirs() {
    this.sharedData.socketInstance.addEventListener('message', this.printData);
    this.sharedData.socketInstance.send('dirs');
  }
  onRead = () => {
    this.sharedData.socketInstance.addEventListener('message', this.readData);
    const path = 'read/' + this.filename;
    this.sharedData.socketInstance.send(path);
  };
  onDels = () => {
    this.sharedData.socketInstance.addEventListener('message', this.printData);
    this.sharedData.socketInstance.send('dels/hello.txt');
  };
  onSave = () => {
    this.sharedData.socketInstance.addEventListener('message', this.printData);
    this.sharedData.socketInstance.send(
      'save/hello.txtgfdsgfsdgfdsgsdfgsdfgsdgsdf'
    );
  };
  connect() {
    // this.sharedData.connectToServer();
    this.updaterRef.current.restartConnection();
    // this.context.
  }
  closeWebSocket() {
    this.sharedData.socketInstance.close();
  }
  onPress = () => {
    this.props.navigation.openDrawer();
  };
  PrintData() {
    console.log(this.data);
  }
  render() {
    return (
      <View style={styles.page}>
        <StatusBar barStyle="light-content" />
        <CommContextUpdater ref={this.updaterRef} />
        <View style={styles.body}>
          <Button color="green" label={'List Files'} onPress={this.onDirs} />
          <Button color="green" label={'Read'} onPress={this.onRead} />
          <Button color="green" label={'Save File'} onPress={this.onSave} />
          <Button color="green" label={'Delete'} onPress={this.onDels} />
          <Button
            color="green"
            label={'Connect to ESP'}
            onPress={this.connect}
          />
          <Button
            color="green"
            label={'Close Connection'}
            onPress={this.closeWebSocket}
          />
          <Button color="green" label={'Print Data'} onPress={this.PrintData} />
          <TextInput
            style={{ height: 40, borderColor: 'black' }}
            placeholder="Enter File to Read:"
            blurOnSubmit={true}
            returnKeyType="done"
            onEndEditing={({ nativeEvent }) =>
              this.handleFilenameChange(nativeEvent.text)
            }
          />
        </View>
      </View>
    );
  }
}
export default HomeScreen;

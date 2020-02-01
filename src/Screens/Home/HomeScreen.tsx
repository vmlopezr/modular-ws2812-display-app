import React from 'react';
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import styles from './HomeScreen.style.';
import SharedData from '../../sharedData';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
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
  constructor(props) {
    super(props);
    this.sharedData = SharedData.getInstance();
    this.width = this.sharedData.width;
    this.height = this.sharedData.height;
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
  readData = event => {
    if (event.data == 'EX1T') {
      this.sharedData.socketInstance.removeEventListener(
        'message',
        this.readData
      );
    } else {
      console.log(event.data);
    }
  };
  onDirs() {
    this.sharedData.socketInstance.addEventListener('message', this.printData);
    this.sharedData.socketInstance.send('dirs');
  }
  onRead() {
    this.sharedData.socketInstance.addEventListener('message', this.readData);
    this.sharedData.socketInstance.send('read/hello.txt');
    // this.sharedData.socketInstance.send(path);
  }
  onDels() {
    this.sharedData.socketInstance.addEventListener('message', this.printData);
    this.sharedData.socketInstance.send('dels/hello.txt');
  }
  onSave() {
    this.sharedData.socketInstance.addEventListener('message', this.printData);
    this.sharedData.socketInstance.send(
      'save/hello.txtgfdsgfsdgfdsgsdfgsdfgsdgsdf'
    );
  }
  connect() {
    this.sharedData.connectToServer();
  }
  closeWebSocket() {
    this.sharedData.socketInstance.close();
  }
  onMenuTouch() {
    alert('Pressed the menu');
  }
  onPress = () => {
    this.props.navigation.openDrawer();
  };
  render() {
    // console.log('Rendering Home Page');
    return (
      <View style={styles.page}>
        <StatusBar barStyle="light-content" />
        <View style={styles.body}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.onDirs();
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Dirs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.onRead();
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Read</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.onSave();
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.onDels();
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.connect();
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.closeWebSocket();
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              Close Connection
            </Text>
          </TouchableOpacity>

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

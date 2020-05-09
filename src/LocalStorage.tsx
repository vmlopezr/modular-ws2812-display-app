export default class LocalStorage {
  private static instance: LocalStorage;
  ESPConn: boolean;
  socketInstance: WebSocket;
  width: number;
  height: number;
  focusedScreen: string;
  defaultFrameDisplayed: string[];
  MatrixType: string;

  constructor() {
    this.ESPConn = false;
    this.width = 8;
    this.height = 8;
    this.focusedScreen = 'Settings';
    this.MatrixType = 'CJMCU-64';
    this.defaultFrameDisplayed = [];
  }

  // Allow global storage to be accessed by files
  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  // Clear the array of defaultFrames from the "Default" screen
  clearDefaultFrames = () => {
    this.defaultFrameDisplayed.splice(0, this.defaultFrameDisplayed.length);
  };

  // Save the input array of frames from the "Default" screen
  setDefaultFrames = (frames: string[]) => {
    this.defaultFrameDisplayed = frames;
  };
  setWidth(width: number) {
    this.width = width;
  }
  setHeight(height: number) {
    this.height = height;
  }
  setMatrixType(matrixType: string) {
    this.MatrixType = matrixType;
  }

  // Close the connection to the ESP32
  close(): void {
    if (this.ESPConn) {
      this.socketInstance.close();
    }
  }

  //Connet to the ESP32
  connectToServer(): void {
    // Set to the ESP32 Access Point
    this.socketInstance = new WebSocket('ws://192.168.4.1/');
    // this.socketInstance = new WebSocket('ws://192.168.1.71/');
  }
}

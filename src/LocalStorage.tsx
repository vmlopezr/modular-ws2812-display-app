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

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }
  clearDefaultFrames = () => {
    this.defaultFrameDisplayed.splice(0, this.defaultFrameDisplayed.length);
  };
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
  close(): void {
    if (this.ESPConn) {
      this.socketInstance.close();
    }
  }
  connectToServer(): void {
    this.socketInstance = new WebSocket('ws://192.168.4.1/');
    // this.socketInstance = new WebSocket('ws://192.168.1.71/');
    // this.socketInstance = new WebSocket('ws://172.25.79.136/');
  }
}

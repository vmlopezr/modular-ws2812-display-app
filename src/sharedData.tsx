export default class SharedData {
  private static instance: SharedData;
  ESPConn: boolean;
  socketInstance: WebSocket;
  width: number;
  height: number;
  constructor() {
    this.ESPConn = false;
    this.width = 1;
    this.height = 1;
  }

  static getInstance(): SharedData {
    if (!SharedData.instance) {
      SharedData.instance = new SharedData();
    }
    return SharedData.instance;
  }
  setWidth(width: number) {
    this.width = width;
  }
  setHeight(height: number) {
    this.height = height;
  }
  connectToServer(): void {
    this.socketInstance = new WebSocket('ws://172.25.17.227/');
    // this.socketInstance = new WebSocket('ws://192.168.1.71/');
  }
}

export default class LocalStorage {
  private static instance: LocalStorage;
  ESPConn: boolean;
  socketInstance: WebSocket;
  width: number;
  height: number;
  constructor() {
    this.ESPConn = false;
    this.width = 1;
    this.height = 1;
  }

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }
  setWidth(width: number) {
    this.width = width;
  }
  setHeight(height: number) {
    this.height = height;
  }
  close(): void {
    if (this.ESPConn) {
      this.socketInstance.close();
    }
  }
  connectToServer(): void {
    // this.socketInstance = new WebSocket('ws://192.168.4.1/');
    this.socketInstance = new WebSocket('ws://192.168.1.71/');
  }
}
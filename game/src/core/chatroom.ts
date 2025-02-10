export default class ChatRoom {
  private messages: Message[];
  static chatRoom: ChatRoom;

  constructor() {
    this.messages = [];
  }

  static getInstance() {
    if (!this.chatRoom) {
      this.chatRoom = new ChatRoom();
    }
    return this.chatRoom;
  }

  getMessages() {
    return this.messages;
  }
}

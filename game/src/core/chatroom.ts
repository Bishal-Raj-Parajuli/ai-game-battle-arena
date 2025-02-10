import { desc, eq } from "drizzle-orm";
import db from "../database/drizzle";
import { chatHistory } from "../database/schema";

export default class ChatRoom {
  private messages: Message[];
  static chatRoom: ChatRoom;

  constructor() {
    this.messages = [];
  }

  static async getInstance() {
    if (!this.chatRoom) {
      this.chatRoom = new ChatRoom();
      await this.chatRoom.LoadMessageFromDatabase();
    }
    return this.chatRoom;
  }

  getMessages() {
    return this.messages.slice(-50);
  }

  async addMessage(playerName: string, message: string) {
    this.messages.push({
      playerName,
      message,
      timestamp: new Date(),
    });
    await db.insert(chatHistory).values({
      name: playerName,
      message,
    });

    // TODO: Test this Logic
    const oldMessage = await db.select().from(chatHistory);
    if (oldMessage.length > 70) {
      await db.delete(chatHistory).where(eq(chatHistory.id, oldMessage[0].id));
    }
  }

  private async LoadMessageFromDatabase() {
    const message = await db
      .select()
      .from(chatHistory)
      .orderBy(desc(chatHistory.timestamp));

    this.messages = message.map((m) => ({
      playerName: m.name,
      message: m.message,
      timestamp: m.timestamp,
    }));
  }
}

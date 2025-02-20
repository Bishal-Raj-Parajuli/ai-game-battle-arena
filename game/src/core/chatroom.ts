import { desc, eq } from "drizzle-orm";
import db from "../database/drizzle";
import { chatHistory } from "../database/schema";
import { MessageCreate } from "@letta-ai/letta-client/api";
import { Letta } from "@letta-ai/letta-client";

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

  getMessages(): MessageCreate[] {
    const messages = this.messages.map((m) => ({
      role: Letta.MessageCreateRole.User,
      // name: m.playerName,
      content: m.message,
    }));
    return messages;
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

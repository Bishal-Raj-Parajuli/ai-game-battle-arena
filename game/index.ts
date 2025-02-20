import { lettaSetup, sendLettaMessage } from "./src/utils/letta";
import ChatRoom from "./src/core/chatroom";
import { seedData } from "./src/database/seed";
import db from "./src/database/drizzle";
import { player } from "./src/database/schema";

async function main() {
  lettaSetup()
    .then(async () => {
      // Trial Message

      const chatRoom = await ChatRoom.getInstance();
      const roomMessages = chatRoom.getMessages();

      const players = await db.select().from(player);

      setInterval(async () => {
        const randomIndex = Date.now() % 2;
        if (players[randomIndex].lettaId) {
          const msg = await sendLettaMessage(
            players[randomIndex].name,
            players[randomIndex].lettaId,
            roomMessages
          );
          console.log(players[randomIndex].name, msg);
        }
      }, 10000);
    })
    .catch((error) => {
      console.error(error);
    });
}

main();

import { lettaSetup } from "./src/utils/letta";
import ChatRoom from "./src/core/chatroom";

async function main() {
  lettaSetup()
    .then(async () => {
      const chatRoom = await ChatRoom.getInstance();
      const room = chatRoom.getMessages();
      console.log(room);
    })
    .catch((error) => {
      console.error(error);
    });
}

main();

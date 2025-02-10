import { lettaSetup } from "./src/utils/letta";
import ChatRoom from "./src/core/chatroom";

async function main() {
  lettaSetup()
    .then(() => {
      const chatRoom = ChatRoom.getInstance();
      const room = chatRoom.getMessages();

      console.log("Chat room messages: ", room);
    })
    .catch((error) => {
      console.error(error);
    });
}

main();

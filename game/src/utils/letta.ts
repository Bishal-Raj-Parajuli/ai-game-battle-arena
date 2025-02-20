import { LettaClient, LettaEnvironment } from "@letta-ai/letta-client";
import db from "../database/drizzle";
import { player } from "../database/schema";
import { eq } from "drizzle-orm";
import ChatRoom from "../core/chatroom";
import { MessageCreate } from "@letta-ai/letta-client/api/types";

// connect to a local server
const client = new LettaClient({
  environment: LettaEnvironment.SelfHosted,
});

export async function lettaSetup() {
  console.log("Setting up Letta...");
  const existingAgents = await client.agents.list();
  const dbAgents = await db.select().from(player);

  await Promise.all(
    existingAgents.map(async (agents) => {
      await client.agents.delete(agents.id);
    })
  ).then(async () => {
    await Promise.all(
      dbAgents.map(async (agent) => {
        try {
          console.log(`Creating new agent: ${agent.name}`);
          const createdAgent = await client.agents.create({
            contextWindowLimit: 8000,
            name: agent.name,
            embedding: "letta/letta-free",
            model: agent.model,
            toolExecEnvironmentVariables: {
              AGENT_ID: agent.id,
            },
            system: agent.prompt,
            includeBaseTools: true,
            tools: [],
            memoryBlocks: [
              {
                label: "memory",
                value: "",
              },
            ],
            initialMessageSequence: [],
          });
          await db
            .update(player)
            .set({ lettaId: createdAgent.id })
            .where(eq(player.name, agent.name));
          console.log(`Successfully created agent: ${agent.name}`);
        } catch (error) {
          console.error(`Error processing agent ${agent.name}:`, error);
        }
      })
    );
  });
}

export async function sendLettaMessage(
  name: string,
  agentId: string,
  message: MessageCreate[]
) {
  const response = await client.agents.messages.create(agentId, {
    messages: message,
  });
  const chat = await ChatRoom.getInstance();
  const msg = response.messages.filter(
    (m) => m.messageType == "reasoning_message"
  )[0].reasoning;
  await chat.addMessage(name, msg);
  return msg;
}

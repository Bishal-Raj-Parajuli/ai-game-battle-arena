import { LettaClient, LettaEnvironment } from "@letta-ai/letta-client";
import db from "../database/drizzle";
import { player } from "../database/schema";

// connect to a local server
const client = new LettaClient({
  environment: LettaEnvironment.SelfHosted,
});

export async function lettaSetup() {
  console.log("Setting up Letta...");
  const existingAgents = await client.agents.list();
  const dbAgents = await db.select().from(player);

  await Promise.all(
    dbAgents.map(async (agent) => {
      console.log(`Processing agent: ${agent.name}`);
      try {
        // Find if agent already exists
        const existingAgent = existingAgents.find(
          (existing) => existing.name === agent.name
        );

        if (!existingAgent) {
          console.log(`Creating new agent: ${agent.name}`);
          await client.agents.create({
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
          console.log(`Successfully created agent: ${agent.name}`);
        }

        if (
          existingAgent &&
          (existingAgent.llmConfig.model !== agent.model ||
            existingAgent.system !== agent.prompt)
        ) {
          // Update existing agent
          console.log(existingAgent.llmConfig.model, existingAgent.system);
          console.log(agent.model, agent.prompt);
          console.log(`Updating existing agent: ${agent.name}`);
          await client.agents.modify(existingAgent.id, {
            llmConfig: {
              model: agent.model,
              modelEndpointType: "google_ai",
              contextWindow: 8000,
            },
            system: agent.prompt,
          });
          console.log(`Successfully updated agent: ${agent.name}`);
        }
      } catch (error) {
        console.error(`Error processing agent ${agent.name}:`, error);
      }
    })
  );
}

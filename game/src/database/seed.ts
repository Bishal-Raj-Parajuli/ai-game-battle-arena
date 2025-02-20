import { eq } from "drizzle-orm";
import { config } from "../utils/config";
import db from "./drizzle";
import { player } from "./schema";

export function seedData() {
  console.log("Seeding data...");

  config.agents.forEach(async (agent) => {
    try {
      const [q] = await db
        .select()
        .from(player)
        .where(eq(player.name, agent.name))
        .limit(1);
      if (!q) {
        await db.insert(player).values({
          name: agent.name,
          prompt: agent.prompt,
          model: agent.model,
        });
        console.log("Successfully seeded data for: ", agent.name);
      } else {
        if (q.prompt !== agent.prompt || q.model !== agent.model) {
          await db
            .update(player)
            .set({
              prompt: agent.prompt,
              model: agent.model,
            })
            .where(eq(player.name, agent.name));
          console.log("Successfully updated data for: ", agent.name);
        }
      }
      return;
    } catch (error) {
      console.error(error);
    }
  });
}

seedData();

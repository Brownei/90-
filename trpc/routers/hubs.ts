import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db, hubs, teams, users, wallets } from "@/lib/db";
import { eq } from "drizzle-orm";
import { encryptData } from "@/utils/utils";

export const hubsRouter = createTRPCRouter({
  launchHubs: baseProcedure
    .input(
      z.object({
        name: z.string(),
        home: z.string(),
        away: z.string()
      })
    )
    .mutation(async ({input}) => {
      const {name, home, away} = input
      const newHub = await db.insert(hubs).values({
        name,
      }).returning({id: hubs.id, name: hubs.name}) 

      await db.insert(teams).values({
        away,
        home,
        hubId: newHub[0].id
      })
    }),

});



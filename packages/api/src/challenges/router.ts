import { createTRPCRouter } from "../trpc";
import * as Controller from "./controller";

export const challengeRouter = createTRPCRouter({
  create: Controller.createChallengeController
});

import { createTRPCRouter } from "../trpc";
import * as Controller from "./controller";

export const challengeRouter = createTRPCRouter({
  create: Controller.createChallengesController,
  list: Controller.listChallengesController,
  delete: Controller.deleteChallengeController,
  update: Controller.updateChallengeController,
  join: Controller.joinChallengeController,
  get: Controller.getChallengeController,
});

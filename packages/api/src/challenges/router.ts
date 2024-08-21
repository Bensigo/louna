import { createTRPCRouter } from "../trpc";
import * as Controller from "./controller";

export const challengeRouter = createTRPCRouter({
  create: Controller.createChallengeController,
  update: Controller.updateChallengeController,
  join: Controller.joinChallengeController,
  get: Controller.getChallengeController,
  list: Controller.listChallengeController,
  delete: Controller.deleteChallengeController,
  generateImage: Controller.generateImageController
});

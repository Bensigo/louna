import { createTRPCRouter } from "../trpc";
import * as Controller from "./controller";

export const authRouter = createTRPCRouter({
  me: Controller.getUserController,
  update: Controller.updateUserController,
  delete: Controller.deleteUserController,
  create: Controller.createUserController,
});

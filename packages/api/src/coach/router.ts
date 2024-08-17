import { createTRPCRouter } from "../trpc";
import { generateNewChallengeSuggestionControlloer } from "./recommendations/challenges/controller";
import { getTipController } from "./recommendations/tips/controller";


export const coachRouter = createTRPCRouter({
    newChallengeSuggestions: generateNewChallengeSuggestionControlloer,
    getHealthInsight: getTipController
})
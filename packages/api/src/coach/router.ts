import { createTRPCRouter } from "../trpc";
import { generateNewChallengeSuggestionControlloer } from "./recommendations/challenges/controller";


export const coachRouter = createTRPCRouter({
    newChallengeSuggestions: generateNewChallengeSuggestionControlloer
})
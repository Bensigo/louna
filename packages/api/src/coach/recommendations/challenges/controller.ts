import { protectedProcedure } from "../../../trpc";
import NewChallengeSuggestionService from "./service";




 

export const generateNewChallengeSuggestionControlloer = protectedProcedure.query(async ({ ctx }) => {
    const { prisma, user } = ctx;
    const userId = user.id;

    // Create date range variables
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
   console.log("======= called ============")
    // Fetch existing suggestions with specific fields


    // Generate and insert new suggestions
    const service = new NewChallengeSuggestionService(userId);
    const newSuggestions = await service.generatChallengeSuggestions();
 
    console.log({ newSuggestions })
    // Insert new suggestions and return them in a single operation
    return newSuggestions
});
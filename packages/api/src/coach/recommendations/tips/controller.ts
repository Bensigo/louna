import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";
import { GetTipSchema, TipAiResponseSchema } from "./schema";
import { TipService } from "./service";

export const getTipController = protectedProcedure
  .input(GetTipSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.user?.id;
    try {
      const { name } = await ctx.prisma.profile.findFirst({
        where: { id: userId },
        select: {
            name: true 
        }
      });
      const { avg, total, min, max, dataType } = input;
      const service = new TipService();
      const prompt = `As a compassionate health expert, provide a personalized, simple insight (in less than 70 words) for ${name} based on their ${dataType} data:
Average: ${avg}
Minimum: ${min}
Maximum: ${max}
${total ? `Total: ${total}` : ''}
Consider their unique situation, offer encouragement, and suggest a gentle way to improve or maintain their  ${dataType}. Be empathetic and supportive in your response.`;

      const suggestion = service.makeSuggestion<
        z.infer<typeof TipAiResponseSchema>
      >(prompt, TipAiResponseSchema);
      return suggestion;
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: error });
    }
  });

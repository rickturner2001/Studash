import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const stepRouter = createTRPCRouter({
  createNewStep: protectedProcedure
    .input(z.object({ assignmentId: z.string(), label: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignmentStep.create({
        data: {
          assignmentId: input.assignmentId,
          label: input.label,
          isCompleted: false,
        },
      });
    }),

  editStepStatus: protectedProcedure
    .input(z.object({ stepId: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.assignmentStep.update({
        where: {
          id: input.stepId,
        },
        data: {
          isCompleted: input.status,
        },
      });
    }),

  // Deletions
  deleteStepById: protectedProcedure
    .input(z.object({ stepId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignmentStep.delete({
        where: {
          id: input.stepId,
        },
      });
    }),
});

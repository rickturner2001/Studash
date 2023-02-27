import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const assignmentsRouter = createTRPCRouter({
  createNewAssignment: protectedProcedure
    .input(
      z.object({
        label: z.string(),
        courseId: z.string(),
        description: z.string(),
        steps: z
          .object({
            label: z.string(),
            isCompleted: z.boolean(),
          })
          .array(),
        deadLine: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.create({
        data: {
          completed: false,
          deadLine: input.deadLine,
          description: input.description,
          userId: ctx.session.user.id,
          label: input.label,
          grade: 0,
          courseId: input.courseId,
          steps: {
            create: input.steps.map((step) => {
              return {
                label: step.label,
                isCompleted: step.isCompleted,
              };
            }),
          },
        },
      });
    }),

  updateAssignment: protectedProcedure
    .input(
      z.object({
        grade: z.number(),
        deadline: z.date(),
        label: z.string(),
        description: z.string(),
        assignmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.update({
        where: {
          id: input.assignmentId,
        },
        data: {
          deadLine: input.deadline,
          description: input.description,
          label: input.label,
          grade: input.grade,
        },
      });
    }),

  updateAssignmentStatus: protectedProcedure
    .input(z.object({ assignmentId: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.update({
        where: {
          id_userId: {
            id: input.assignmentId,
            userId: ctx.session.user.id,
          },
        },
        data: {
          completed: input.status,
        },
      });
    }),

  addAssignmentStep: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        label: z.string(),
        isCompleted: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignmentStep.create({
        data: {
          label: input.label,
          assignmentId: input.assignmentId,
          isCompleted: input.isCompleted,
        },
      });
    }),

  updateAssignmentStep: protectedProcedure
    .input(
      z.object({
        stepId: z.string(),
        isCompleted: z.boolean(),
        label: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignmentStep.update({
        where: {
          id: input.stepId,
        },
        data: {
          isCompleted: input.isCompleted,
          label: input.label,
        },
      });
    }),

  // Queries
  getAllUserAssignments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.assignment.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getAssignmentById: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.findUnique({
        where: {
          id_userId: {
            id: input.assignmentId,
            userId: ctx.session.user.id,
          },
        },
        include: {
          course: true,
          steps: true,
        },
      });
    }),

  getAssignmentStepsByAssignmentId: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.assignmentStep.findMany({
        where: {
          assignmentId: input.assignmentId,
        },
      });
    }),

  // Deletions

  deleteAssignmentStep: protectedProcedure
    .input(z.object({ stepId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignmentStep.delete({
        where: {
          id: input.stepId,
        },
      });
    }),

  deleteAssignment: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.assignment.delete({
        where: {
          id: input.assignmentId,
        },
      });
    }),
});

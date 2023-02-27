import { Input } from "postcss";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const courseRouter = createTRPCRouter({
  createNewCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        name: z.string(),
        instructor: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.create({
        data: {
          id: input.courseId,
          instructor: input.instructor,
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),
  addCourseAssignment: protectedProcedure
    .input(z.object({ assignmentId: z.string(), courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.update({
        where: {
          userId_id: {
            id: input.courseId,
            userId: ctx.session.user.id,
          },
        },
        data: {
          assignments: {
            connect: {
              id_userId: {
                id: input.assignmentId,
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });
    }),
  removeCourseAssignment: protectedProcedure
    .input(z.object({ courseId: z.string(), assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.update({
        where: {
          userId_id: {
            id: input.courseId,
            userId: ctx.session.user.id,
          },
        },
        data: {
          assignments: {
            disconnect: {
              id_userId: {
                id: input.assignmentId,
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });
    }),

  // Deletions
  deleteCourse: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.course.delete({
        where: {
          userId_id: {
            id: input.courseId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  // queries

  getCourseSpecificsById: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.course.findUnique({
        where: {
          userId_id: {
            id: input.courseId,
            userId: ctx.session.user.id,
          },
        },
        include: {
          assignments: {
            include: {
              steps: true,
            },
          },
        },
      });
    }),

  getAllUserCourses: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.course.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});

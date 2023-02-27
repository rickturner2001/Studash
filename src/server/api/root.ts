import { createTRPCRouter } from "~/server/api/trpc";
import { assignmentsRouter } from "~/server/api/routers/assignments";
import { courseRouter } from "./routers/courses";
import { stepRouter } from "./routers/steps";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  assignments: assignmentsRouter,
  courses: courseRouter,
  steps: stepRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

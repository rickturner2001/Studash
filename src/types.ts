import type { Assignment, AssignmentStep, Course } from "@prisma/client";

export type Section = "dashboard" | "courses" | "grades" | "assignments";
export type CourseSection = "creation" | "listing" | "specific";

export type CourseWithAssignmentsAndSteps = Course & {
  assignments: (Assignment & {
    steps: AssignmentStep[];
  })[];
};

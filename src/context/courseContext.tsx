import { type Dispatch, type SetStateAction, createContext } from "react";
import type { CourseSection } from "~/types";

interface CourseContextValue {
  currentCourseSection: CourseSection;
  setCurrentCourseSection: Dispatch<SetStateAction<CourseSection>>;
  currentEditId: string;
  setCurrentEditId: Dispatch<SetStateAction<string>>;
}

const courseContext = createContext<CourseContextValue>({
  currentCourseSection: "listing",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentCourseSection: () => {},
  currentEditId: "",
  setCurrentEditId: () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  },
});

export default courseContext;

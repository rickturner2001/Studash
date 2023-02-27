import { type Dispatch, type SetStateAction, createContext } from "react";
import type { Section } from "../types";

interface ApplicationContextValue {
  currentSection: Section;
  setCurrentSection: Dispatch<SetStateAction<Section>>;
}

const applicationContext = createContext<ApplicationContextValue>({
  currentSection: "dashboard",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentSection: () => {},
});

export default applicationContext;

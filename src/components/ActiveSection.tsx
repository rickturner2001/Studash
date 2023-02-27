import { useContext } from "react";
import SectionLayout from "./SectionLayout";
import AssignmentsSection from "./sections/AssignmentsSection";
import CoursesSection from "./sections/CoursesSection";
import applicationContext from "~/context/applicationContext";

const ActiveSection = () => {
  const { currentSection } = useContext(applicationContext);

  return currentSection === "assignments" ? (
    <AssignmentsSection />
  ) : currentSection === "courses" ? (
    <CoursesSection />
  ) : (
    <div></div>
  );
};

export default ActiveSection;

import { useState } from "react";
import SectionHeader from "../SectionHeader";
import SectionLayout from "../SectionLayout";

const AssignmentsSection = () => {
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  return (
    <>
      <SectionHeader
        handler={() => setIsCreatingAssignment(true)}
        buttonText="New assignment"
      />
      <SectionLayout>
        <div>
          <h2 className="text-xl font-semibold">Your assignments</h2>
        </div>
      </SectionLayout>
    </>
  );
};

export default AssignmentsSection;

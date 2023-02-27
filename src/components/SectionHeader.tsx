import { Dispatch, SetStateAction, useContext } from "react";
import applicationContext from "~/context/applicationContext";

const SectionHeader = ({ children }: { children?: JSX.Element }) => {
  const { currentSection } = useContext(applicationContext);

  return (
    <div className="relative z-20 bg-cyan-600 px-20 py-4 lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
          {currentSection}
        </h2>
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        {children}

        {/* Dropdown */}
      </div>
    </div>
  );
};

export default SectionHeader;

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";
import { api } from "~/utils/api";
import Datepicker from "tailwind-datepicker-react";

const options = {
  title: "Deadline",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  maxDate: new Date("2030-01-01"),
  minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-white ",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "bg-gray-300 hover:bg-white",
    input: "",
    inputIcon: "",
    selected: "",
  },
  icons: {
    // () => ReactNode | JSX.Element
    prev: () => <span>Previous</span>,
    next: () => <span>Next</span>,
  },
  datepickerClassNames: "top-12",
  defaultDate: new Date("2022-01-01"),
  language: "en",
};

const CreateAssignment = () => {
  const router = useRouter();

  const { sectionId } = router.query;
  const sectionIdAsString = sectionId as string;

  const [steps, setSteps] = useState<string[]>([]);

  const [deadline, setDeadline] = useState(new Date());

  const setpRef = useRef<HTMLInputElement>(null);
  const assignmentLabel = useRef<HTMLInputElement>(null);
  const assignmentDescrption = useRef<HTMLTextAreaElement>(null);

  const [show, setShow] = useState<boolean>(false);
  const handleChange = (selectedDate: Date) => {
    setDeadline(selectedDate);
  };
  const handleClose = (state: boolean) => {
    setShow(state);
  };

  const { mutate, isSuccess, isLoading, isError } =
    api.assignments.createNewAssignment.useMutation();

  return (
    <>
      <Navbar />
      <SectionHeader>
        <Link
          href={"/courses"}
          className={`inline-flex items-center rounded-md ${"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none  focus:ring-indigo-500 "} px-4 py-2  text-sm font-medium shadow-sm focus:ring-2  focus:ring-offset-2 `}
        >
          Courses listing
        </Link>
      </SectionHeader>
      <div className="mx-auto mt-12 max-w-7xl md:grid  md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Add Assignment
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Create a new assignment to be added to {sectionIdAsString}
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <div>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="label"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Label
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        ref={assignmentLabel}
                        type="text"
                        id="label"
                        className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="www.example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      ref={assignmentDescrption}
                      name="about"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="you@example.com"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description for your assignment.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Deadline
                  </label>
                  <Datepicker
                    options={options}
                    onChange={handleChange}
                    show={show}
                    setShow={handleClose}
                  />
                </div>

                <div>
                  <div className="w-full">
                    <label
                      htmlFor="step"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Assignment steps
                    </label>

                    <div className="mt-1 flex gap-x-2">
                      <input
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = setpRef?.current?.value;
                            if (value) {
                              setSteps((prev) => [...prev, value]);
                              setpRef.current.value = "";
                            }
                          }
                        }}
                        ref={setpRef}
                        id="step"
                        className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Prepare for the graded quiz"
                      />
                      <button
                        onClick={() => {
                          const value = setpRef?.current?.value;
                          if (value) {
                            setSteps((prev) => [...prev, value]);
                            setpRef.current.value = "";
                          }
                        }}
                        className="inline-flex items-center rounded-md bg-cyan-100 px-4 py-2 text-sm text-cyan-900 "
                      >
                        <PlusIcon className="mr-2 h-5 w-5" />
                        Add step
                      </button>
                    </div>

                    <div className="mt-4">
                      {steps.map((step) => {
                        return (
                          <div
                            className="mt-1 flex items-center justify-between rounded-md border py-2 px-3 text-sm"
                            key={step}
                          >
                            <span>{step}</span>
                            <button
                              className="rounded-md bg-red-100 p-2 text-sm text-red-900 hover:bg-red-200"
                              onClick={() => {
                                setSteps((prev) =>
                                  prev.filter((s) => s !== step)
                                );
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  onClick={() => {
                    if (
                      assignmentDescrption?.current?.value &&
                      assignmentLabel?.current?.value
                    ) {
                      mutate({
                        courseId: sectionIdAsString,
                        description: assignmentDescrption.current.value,
                        label: assignmentLabel.current.value,
                        steps: steps.map((step) => {
                          return { isCompleted: false, label: step };
                        }),
                        deadLine: deadline,
                      });
                    }
                  }}
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAssignment;

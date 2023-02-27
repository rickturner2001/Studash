import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { AssignmentStep } from "@prisma/client";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";
import Spinner from "~/components/Spinner";
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
  defaultDate: new Date(),
  language: "en",
};

const AssignmentDisplayWrapper = ({
  assignmentId,
}: {
  assignmentId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [deadline, setDeadline] = useState(new Date());
  const [show, setShow] = useState<boolean>(false);
  const handleChange = (selectedDate: Date) => {
    setDeadline(selectedDate);
  };
  const handleClose = (state: boolean) => {
    setShow(state);
  };

  const utils = api.useContext();

  const {
    mutate: updateAssignmentMutation,
    isLoading: loadingAssignmentUpdate,
  } = api.assignments.updateAssignment.useMutation({
    onSuccess: async () => {
      await utils.assignments.getAssignmentById.invalidate();
      setIsEditing(false);
    },
  });

  const { mutate: updateStatusMutation, isLoading: loadingStatusMutation } =
    api.assignments.updateAssignmentStatus.useMutation({
      onSuccess: async () => {
        await utils.assignments.getAssignmentById.invalidate();
      },
    });

  const { mutate: createStepMutation, isLoading: loadingStepCreation } =
    api.steps.createNewStep.useMutation({
      onSuccess: async () => {
        await utils.assignments.getAssignmentById.invalidate();
      },
    });

  const { data: assignment } = api.assignments.getAssignmentById.useQuery({
    assignmentId: assignmentId,
  });

  const stepRef = useRef<HTMLInputElement>(null);

  const gradeRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  if (!assignment) {
    return <div></div>;
  }

  const timeDiff = assignment.deadLine.getTime() - new Date().getTime();

  const daysDiff = Math.ceil(
    Math.abs(
      (assignment.deadLine.getTime() - new Date().getTime()) /
        (24 * 60 * 60 * 1000)
    )
  );
  return (
    <>
      <Navbar />
      <SectionHeader>
        <button></button>
      </SectionHeader>
      {!assignment ? (
        <div className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-center">
          <Spinner className="mx-auto h-8 w-8" />
        </div>
      ) : (
        <div className="mx-auto mt-12 flex max-w-7xl flex-col px-12 py-12 text-center md:text-start">
          <div className="flex flex-col-reverse items-center gap-y-4 md:flex-row md:justify-between ">
            {isEditing ? (
              <input
                className="rounded-md border border-gray-200 py-2 px-4 text-gray-700 focus:outline-none"
                ref={labelRef}
                defaultValue={assignment.label}
              />
            ) : (
              <h1 className="text-xl">{assignment.label}</h1>
            )}
            <div className="flex items-center space-x-2">
              {isEditing ? (
                loadingAssignmentUpdate ? (
                  <button className="inline-flex items-center rounded-lg bg-blue-100 px-5 py-2.5 text-sm text-blue-900 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300">
                    <Spinner className="mr-2 h-4 w-4" />
                    loading
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      updateAssignmentMutation({
                        assignmentId: assignment.id,
                        deadline:
                          deadline === new Date()
                            ? assignment.deadLine
                            : deadline,
                        description:
                          descriptionRef?.current?.value ??
                          assignment.description,
                        label: labelRef?.current?.value ?? assignment.label,
                        grade:
                          +(gradeRef?.current?.value ?? 0) ?? assignment.grade,
                      })
                    }
                    className="inline-flex items-center rounded-lg bg-blue-100 px-5 py-2.5 text-sm text-blue-900 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300"
                  >
                    Save
                  </button>
                )
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center rounded-lg bg-amber-100 px-5 py-2.5 text-sm text-amber-900 hover:bg-amber-200 focus:ring-2 focus:ring-amber-300"
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </button>
              )}
              {isEditing ? (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center rounded-lg bg-red-100 px-5 py-2.5 text-sm text-red-900 hover:bg-red-200 focus:ring-2 focus:ring-red-300"
                >
                  <XMarkIcon className="mr-2 h-4 w-4" />
                  Undo
                </button>
              ) : (
                <button className="inline-flex items-center rounded-lg bg-red-100 px-5 py-2.5 text-sm text-red-900 hover:bg-red-200 focus:ring-2 focus:ring-red-300">
                  <XMarkIcon className="mr-2 h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
          {isEditing ? (
            <textarea
              rows={2}
              ref={descriptionRef}
              defaultValue={assignment.description}
              className="my-6 rounded-md border border-gray-200 py-2 px-4 text-gray-700 focus:outline-none"
            />
          ) : (
            <p className="mx-auto max-w-md py-8 text-sm text-gray-700 md:mx-0 md:max-w-lg md:text-base ">
              {assignment.description}
            </p>
          )}

          <span className="block text-lg">Assignment deadline</span>
          {isEditing ? (
            <Datepicker
              options={options}
              onChange={handleChange}
              show={show}
              setShow={handleClose}
            />
          ) : (
            <span className="block py-2 font-bold text-red-900">
              {assignment.deadLine.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              ({daysDiff.toString() + (timeDiff < 0 ? " days ago" : " days")} )
            </span>
          )}

          {isEditing ? (
            <input
              ref={gradeRef}
              className="focus-outline-none mt-4 rounded-md border border-gray-300 py-2 px-4 text-gray-700"
            />
          ) : assignment.grade ? (
            <div className="mt-4 flex items-center gap-x-4">
              <span className=" block text-lg">Assignment grade</span>
              <span className=" block rounded-md bg-cyan-100 p-2 font-bold   text-cyan-900">
                {assignment.grade}
              </span>
            </div>
          ) : (
            <></>
          )}

          {assignment.completed ? (
            loadingAssignmentUpdate ? (
              <button className="mt-4 inline-flex items-center rounded-md bg-cyan-100 px-5 py-2.5 text-sm text-cyan-900 hover:bg-cyan-200 focus:ring-2 focus:ring-cyan-300">
                <Spinner className="mr-2 h-4 w-4" />
                loading
              </button>
            ) : (
              <button
                onClick={() =>
                  updateStatusMutation({
                    assignmentId: assignmentId,
                    status: false,
                  })
                }
                className="mt-4 rounded-md bg-red-100 px-5 py-2.5 text-sm text-red-900 hover:bg-red-200 focus:ring-2 focus:ring-red-300"
              >
                Mark as incomplete
              </button>
            )
          ) : (
            <button
              onClick={() =>
                updateStatusMutation({
                  assignmentId: assignmentId,
                  status: true,
                })
              }
              className="mt-4 rounded-md bg-cyan-100 px-5 py-2.5 text-sm text-cyan-900 hover:bg-cyan-200 focus:ring-2 focus:ring-cyan-300"
            >
              Mark as complete
            </button>
          )}
          <div className="my-6 w-full border border-t"></div>

          <div className="w-ful my-6 flex flex-col items-center justify-between gap-y-4 md:flex-row">
            <h2 className="text-xl">Assignment steps</h2>
            <div className="flex gap-x-4">
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (stepRef?.current?.value) {
                      createStepMutation({
                        assignmentId: assignment.id,
                        label: stepRef.current.value,
                      });
                      stepRef.current.value = "";
                    }
                  }
                }}
                placeholder="My new step"
                ref={stepRef}
                className="rounded-md border border-gray-300 text-gray-700 outline-none  focus-visible:outline-none"
              />
              {loadingStepCreation ? (
                <button className="inline-flex items-center rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300">
                  <Spinner className="mr-2  h-4 w-4" />
                  loading
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (stepRef?.current?.value) {
                      createStepMutation({
                        assignmentId: assignment.id,
                        label: stepRef.current.value,
                      });
                      stepRef.current.value = "";
                    }
                  }}
                  className="inline-flex items-center rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300"
                >
                  <PlusIcon className="mr-2  h-4 w-4" />
                  Add step
                </button>
              )}
            </div>
          </div>

          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-8">
            {assignment.steps.map((step) => {
              return <StepDisplay key={step.id} step={step} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

const AssignmentDisplay = () => {
  const router = useRouter();
  const { assignmentId } = router.query;

  if (!assignmentId) {
    return <></>;
  }

  return <AssignmentDisplayWrapper assignmentId={assignmentId as string} />;
};

const StepDisplay = ({ step }: { step: AssignmentStep }) => {
  const utils = api.useContext();
  const { mutate: deleteStepMutation, isLoading: isLoadingDeletion } =
    api.steps.deleteStepById.useMutation({
      onSuccess: async () => {
        await utils.assignments.getAssignmentById.invalidate();
      },
    });

  const { mutate: editStatusMutation, isLoading: isLoadingStatus } =
    api.steps.editStepStatus.useMutation({
      onSuccess: async () => {
        await utils.assignments.getAssignmentById.invalidate();
      },
    });

  return (
    <div
      className={`relative flex w-full max-w-md flex-col items-center justify-center rounded-md border ${
        step.isCompleted ? "bg-emerald-100" : ""
      } p-8 shadow-md `}
    >
      {!step.isCompleted && (
        <span className="absolute top-2 right-2  text-xs text-pink-900">
          Incomplete
        </span>
      )}
      <p className="text-sm capitalize">{step.label}</p>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-x-2 gap-y-2 md:flex-row">
        {isLoadingStatus ? (
          <button className="inline-flex items-center rounded-md bg-cyan-100 px-4 py-2 text-xs text-cyan-900 hover:bg-cyan-200 focus:ring-2 focus:ring-cyan-300">
            <Spinner className="mr-2 h-4 w-4" />
            loading
          </button>
        ) : step.isCompleted ? (
          <button
            onClick={() =>
              editStatusMutation({ status: false, stepId: step.id })
            }
            className={`inline-flex items-center rounded-md ${
              step.isCompleted
                ? " bg-indigo-100 text-indigo-900 hover:bg-indigo-200  focus:ring-indigo-300"
                : " bg-indigo-100 text-indigo-900 hover:bg-indigo-200  focus:ring-indigo-300"
            } px-4 py-2 text-xs focus:ring-2 `}
          >
            Mark as incomplete
          </button>
        ) : (
          <button
            onClick={() =>
              editStatusMutation({ status: true, stepId: step.id })
            }
            className="inline-flex items-center rounded-md bg-cyan-100 px-4 py-2 text-xs text-cyan-900 hover:bg-cyan-200 focus:ring-2 focus:ring-cyan-300"
          >
            Mark as complete
          </button>
        )}
        {isLoadingDeletion ? (
          <button className="inline-flex items-center rounded-md bg-red-100 px-4 py-2 text-xs text-red-900 hover:bg-red-200 focus:ring-2 focus:ring-red-300">
            <Spinner className="mr-2 h-4 w-4" />
            loading
          </button>
        ) : (
          <button
            onClick={() => deleteStepMutation({ stepId: step.id })}
            className="inline-flex items-center rounded-md bg-red-100 px-4 py-2 text-xs text-red-900 hover:bg-red-200 focus:ring-2 focus:ring-red-300"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </button>
        )}
      </div>{" "}
    </div>
  );
};
export default AssignmentDisplay;

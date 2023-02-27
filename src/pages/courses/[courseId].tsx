import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Assignment, AssignmentStep } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const CourseSpecificWrapper = ({ courseId }: { courseId: string }) => {
  const { data: courseData } = api.courses.getCourseSpecificsById.useQuery({
    courseId: courseId,
  });
  return (
    <>
      <Navbar />
      <SectionHeader />
      <div className="mx-auto mt-12 max-w-7xl">
        <h2 className="text-xl font-semibold">{}</h2>
        {courseData ? (
          <div className="px-8">
            <span className="rounded-md bg-cyan-100 px-4 py-2 text-sm text-cyan-900">
              {courseData.id}
            </span>
            <div className="mt-4 flex w-full items-center justify-between">
              <h1 className="text-2xl">{courseData.name}</h1>
              <span className="text-gray-800">{courseData.instructor}</span>
            </div>

            <div className="mt-12 rounded-md border "></div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-4">
              <Link
                href={`/assignments/new/${courseData.id}`}
                className="inline-flex items-center rounded-md bg-emerald-100 px-5 py-2.5 text-sm text-emerald-900 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add assignment
              </Link>
              {courseData.assignments.map((assignment) => {
                return (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-12 flex items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        )}
      </div>
    </>
  );
};

const CourseSpecific = () => {
  const router = useRouter();
  const { courseId } = router.query;

  if (!courseId) {
    return <></>;
  }
  return <CourseSpecificWrapper courseId={courseId as string} />;
};

const AssignmentCard = ({
  assignment,
}: {
  assignment: Assignment & {
    steps: AssignmentStep[];
  };
}) => {
  const utils = api.useContext();
  const { mutate, isLoading } = api.assignments.deleteAssignment.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  return (
    <div
      className={`relative flex w-full max-w-md flex-col items-center justify-center rounded-md p-4 ring-2 ${
        assignment.completed ? "ring-emerald-300" : "ring-red-300"
      }`}
      key={assignment.id}
    >
      {isLoading ? (
        <button className="absolute top-2 right-2 inline-flex items-center rounded-md bg-red-100 p-2 text-sm text-red-500 hover:bg-red-200 focus:ring-2 focus:ring-red-300">
          <Spinner className="mr-2 h-4 w-4" />
          loading
        </button>
      ) : (
        <button
          onClick={() => mutate({ assignmentId: assignment.id })}
          className="absolute top-2 right-2 rounded-md bg-red-100 p-2 text-sm text-red-500 hover:bg-red-200 focus:ring-2 focus:ring-red-300"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}

      <p className="text-sm">{assignment.label}</p>
      <p className="py-4 text-center text-xs text-gray-600">
        {assignment.description}
      </p>
      <div className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-2">
        {assignment.steps.map((step) => {
          return (
            <span
              key={step.label}
              className={`rounded-full p-2  ${
                step.isCompleted ? "bg-green-400" : "bg-amber-400"
              }`}
            ></span>
          );
        })}
      </div>

      <Link
        href={`/assignments/${assignment.id}`}
        className="mt-6 inline-flex items-center rounded-md bg-indigo-100 px-4 py-2 text-sm text-indigo-900 hover:bg-indigo-200"
      >
        <EyeIcon className="mr-2 h-4 w-4" />
        View assignment
      </Link>
    </div>
  );
};

export default CourseSpecific;

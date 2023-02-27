import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Course } from "@prisma/client";
import Link from "next/link";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";
import SectionLayout from "~/components/SectionLayout";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const CoursesListing = () => {
  const { data: courses } = api.courses.getAllUserCourses.useQuery();

  if (!courses) {
    return (
      <>
        <SectionHeader>
          <button
            type="button"
            className={`inline-flex items-center rounded-md ${"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none  focus:ring-indigo-500 "} px-4 py-2  text-sm font-medium shadow-sm focus:ring-2  focus:ring-offset-2 `}
          >
            New Course
          </button>
        </SectionHeader>
        <SectionLayout>
          <div className="flex h-full w-full items-center justify-center ">
            <Spinner className="h-8 w-8" />
          </div>
        </SectionLayout>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <SectionHeader>
        <Link
          href={"/courses/new"}
          type="button"
          className={`inline-flex items-center rounded-md ${"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none  focus:ring-indigo-500 "} px-4 py-2  text-sm font-medium shadow-sm focus:ring-2  focus:ring-offset-2 `}
        >
          New Course
        </Link>
      </SectionHeader>
      <div className="mx-auto mt-12 w-full max-w-7xl">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-6 rounded-md border p-8">
          {courses.length ? (
            courses.map((course) => {
              return <CourseCard key={course.id} course={course} />;
            })
          ) : (
            <div className="mx-auto flex w-max flex-col gap-y-4">
              <p className="text-sm text-gray-600">
                There are not courses to display
              </p>
              <Link
                href={"sections/create"}
                className="mx-auto w-max rounded-md bg-emerald-100 px-5  py-2.5 text-sm font-bold text-emerald-900 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300"
              >
                New Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  const utils = api.useContext();

  const { mutate: deleteCourseMutation, isLoading } =
    api.courses.deleteCourse.useMutation({
      onSuccess: async () => {
        await utils.courses.getAllUserCourses.invalidate();
      },
    });

  return (
    <div
      key={course.id}
      className="relative flex w-full max-w-md flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow "
    >
      <p className="text-sm">{course.id}</p>
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {course.name}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {course.instructor}
      </p>
      <Link
        href={`/courses/${course.id}`}
        className="inline-flex w-max items-center rounded-lg bg-cyan-100 px-3 py-2 text-center text-sm font-medium text-cyan-900 hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Go to Course
        <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 stroke-2" />
      </Link>

      {isLoading ? (
        <button
          onClick={() => deleteCourseMutation({ courseId: course.id })}
          className="absolute top-2 right-2 rounded-md bg-red-100 p-2 text-sm text-red-900 hover:bg-red-200 focus:ring-2 focus:ring-red-300"
        >
          <Spinner className="h-4 w-4 stroke-2" />
        </button>
      ) : (
        <button
          onClick={() => deleteCourseMutation({ courseId: course.id })}
          className="absolute top-2 right-2 rounded-md bg-red-100 p-2 text-sm text-red-900 hover:bg-red-200 focus:ring-2 focus:ring-red-300"
        >
          <TrashIcon className="h-4 w-4 stroke-2" />
        </button>
      )}
    </div>
  );
};
export default CoursesListing;

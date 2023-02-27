import { motion } from "framer-motion";
import { useRef, useState, useContext } from "react";
import { api } from "~/utils/api";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import courseContext from "~/context/courseContext";
import Spinner from "~/components/Spinner";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";
import Link from "next/link";
import { useRouter } from "next/router";

const CourseCreationForm = () => {
  const utils = api.useContext();

  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const {
    mutate: createCourseMutation,
    isLoading: loadingCourseCreation,
    isSuccess: isCourseSuccess,
    isError: isCourseCreationError,
  } = api.courses.createNewCourse.useMutation({
    onSuccess: async () => {
      setIsError(false);
      await utils.courses.getAllUserCourses.invalidate();
      await router.push("/");
    },
  });

  const courseIdRef = useRef<HTMLInputElement>(null);
  const courseNameRef = useRef<HTMLInputElement>(null);
  const courseInstructorRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Navbar />
      <SectionHeader>
        <Link
          href={"/"}
          className={`inline-flex items-center rounded-md ${"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none  focus:ring-indigo-500 "} px-4 py-2  text-sm font-medium shadow-sm focus:ring-2  focus:ring-offset-2 `}
        >
          Courses listing
        </Link>
      </SectionHeader>
      <div className="mx-auto mt-12 w-full max-w-7xl">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Course Cration
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                This is the Course Creation section where you can create and
                manage courses for your students and teachers. By registering a
                new course, you can keep track of important details such as the
                course name, description, Assignments, and more.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                      <div className="flex w-full gap-x-4">
                        <div className="w-1/3">
                          <label
                            htmlFor="course-id"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Course ID
                          </label>
                          <input
                            ref={courseIdRef}
                            type="text"
                            name="Course ID"
                            id="course-id"
                            className="mt-2 block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="CS 2205-01"
                          />
                        </div>
                        <div className="w-2/3">
                          <label
                            htmlFor="course-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Course name
                          </label>
                          <input
                            ref={courseNameRef}
                            type="text"
                            name="Course name"
                            id="course-name"
                            className="mt-2 block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Web Programming 1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="instructor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Instructor
                    </label>
                    <div className="mt-1">
                      <input
                        ref={courseInstructorRef}
                        type="text"
                        name="instructor"
                        id="instructor"
                        className="mt-2 block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Mr. John Awesome"
                      />
                    </div>
                  </div>
                </div>
                {isError ||
                  (isCourseCreationError && (
                    <div
                      id="alert-2"
                      className="mx-4 mb-4 flex rounded-lg bg-red-50 p-4 text-red-800 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <InformationCircleIcon className="h-5 w-5 flex-shrink-0" />

                      <span className="sr-only">Info</span>
                      <div className="ml-3 text-sm font-medium">
                        There was an error creating this course
                      </div>
                      {!isCourseCreationError && (
                        <button
                          onClick={() => setIsError(false)}
                          type="button"
                          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-200 focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                          data-dismiss-target="#alert-2"
                          aria-label="Close"
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  {loadingCourseCreation ? (
                    <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <Spinner className="mr-2 h-4 w-4" />
                      loading
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (
                          courseNameRef?.current?.value &&
                          courseIdRef?.current?.value &&
                          courseInstructorRef?.current?.value
                        ) {
                          createCourseMutation({
                            courseId: courseIdRef.current.value,
                            name: courseNameRef.current.value,
                            instructor: courseInstructorRef.current.value,
                          });

                          courseIdRef.current.value = "";
                          courseNameRef.current.value = "";
                          courseInstructorRef.current.value = "";
                        } else {
                          setIsError(true);
                        }
                      }}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCreationForm;

import { CourseCategory, ICourseCategory } from "@/components/CourseCategory/CourseCategory";
import { NextPage } from "next";

const courseCategory: ICourseCategory = {
  name: "Frontend Development",
  description:
    "Learn to build a portfolio website using web technologies, that captivates users interest and drives more attention from all around the world",
  courses: [
    {
      name: "Foundations of Web Development",
      tools: ["HTML", "CSS"],
    },
    {
      name: "Foundations of Web Development",
      tools: ["HTML", "CSS"],
    },
    {
      name: "Foundations of Web Development",
      tools: ["HTML", "CSS"],
    },
    {
      name: "Foundations of Web Development",
      tools: ["HTML", "CSS"],
    },
  ],
};

const CoursesCategoryPage: NextPage = () => <CourseCategory direction="ltr" category={courseCategory} />;

export default CoursesCategoryPage;

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
export let cookieName = appConstant.development.cookieName;
if (process.env.NODE_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const percentage = (partialValue?: number, totalValue?: number) => {
      return (100 * Number(partialValue)) / Number(totalValue) > 0
        ? (100 * Number(partialValue)) / Number(totalValue)
        : 0;
    };

    const authorId = Number(token?.id);
    const allRegisterCourse = await prisma.courseRegistration.findMany({
      orderBy: [{ createdAt: "asc" }],
      where: {
        studentId: Number(authorId),
      },
      include: {
        course: {
          include: {
            courseProgress: {
              orderBy: [{ createdAt: "asc" }],

              where: {
                studentId: Number(authorId),
              },
            },
          },
        },
      },
    });
    const courseListData = allRegisterCourse.map((courseData) => {
      return {
        courseName: courseData.course.name,
        courseId: courseData.courseId,
        progress: `${Math.floor(
          percentage(courseData.course.courseProgress.pop()?.lessonsCompleted, courseData.course.totalResources)
        )}%`,
      };
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "registered courses successfully fetched",

      progress: courseListData,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

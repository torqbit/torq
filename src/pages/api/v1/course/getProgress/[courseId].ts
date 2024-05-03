import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { StateType } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
export let cookieName = appConstant.development.cookieName;
if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = token?.id;

    const course = await prisma.course.findUnique({
      where: {
        courseId: Number(courseId),
      },
      include: {
        chapters: {
          where: {
            courseId: Number(courseId),
          },
          include: {
            resource: {
              where: {
                state: "ACTIVE",
              },
              include: {
                video: {},
              },
            },
          },
        },
      },
    });

    const findProgress = await prisma.courseProgress.findMany({
      orderBy: [{ createdAt: "asc" }],

      where: {
        studentId: authorId,
        courseId: Number(courseId),
      },
    });

    if (findProgress.length) {
      let lastIndex = findProgress.length > 0 ? findProgress.length - 1 : 0;

      const currentResource = await prisma.resource.findUnique({
        where: {
          resourceId: findProgress[lastIndex]?.resourceId,
        },
      });

      const currChapter = await prisma.chapter.findUnique({
        where: {
          chapterId: findProgress[lastIndex]?.chapterId,
        },
        include: {
          resource: {
            where: {
              state: "ACTIVE",
            },
            include: {
              video: {},
            },
          },
        },
      });
      let nextLesson;
      let nextChap;
      let completed;
      if (currentResource && currChapter && currChapter?.resource.length > currentResource?.sequenceId) {
        nextChap = currChapter;
        nextLesson = currChapter.resource.find((r) => r.sequenceId === currentResource.sequenceId + 1);
        completed = false;
      }
      if (currentResource && currChapter && currChapter?.resource.length === currentResource?.sequenceId) {
        nextChap = course?.chapters.find((chapter) => chapter.sequenceId === currChapter.sequenceId + 1);
        nextLesson = nextChap?.resource[0];
        completed = false;
      }
      if (
        course?.chapters.length === currChapter?.sequenceId &&
        currChapter?.resource.length === currentResource?.sequenceId
      ) {
        nextChap = course?.chapters[0];
        nextLesson = nextChap?.resource[0];
        completed = true;
      }
      let progressData = {
        nextChap: nextChap,
        nextLesson: nextLesson,
        completed: completed,
      };

      return res.status(200).json({
        info: false,
        success: true,
        message: "course successfully fetched",
        courseDetails: course,

        latestProgress: progressData,
      });
    } else {
      return res.status(200).json({
        info: false,
        success: true,
        message: "course successfully fetched",
        latestProgress: {
          nextChap: course?.chapters[0],
          nextLesson: course?.chapters[0].resource[0],
        },
        courseDetails: course,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

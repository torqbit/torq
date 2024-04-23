import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { StateType } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
export let cookieName = appConstant.development.cookieName;
if (process.env.NODE_ENV === "production") {
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

    const authorId = Number(token?.id);

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
    console.log("progress", findProgress);

    if (findProgress.length) {
      console.log("hit progress", findProgress);
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
            include: {
              video: {},
            },
          },
        },
      });
      let nextLesson;
      let nextChap;
      if (currentResource && currChapter && currChapter?.resource.length > currentResource?.sequenceId) {
        nextChap = currChapter;
        nextLesson = currChapter.resource.find((r) => r.sequenceId === currentResource.sequenceId + 1);
      }
      if (currentResource && currChapter && currChapter?.resource.length === currentResource?.sequenceId) {
        nextChap = course?.chapters.find((chapter) => chapter.sequenceId === currChapter.sequenceId + 1);
        nextLesson = nextChap?.resource[0];
      }
      if (
        course?.chapters.length === currChapter?.sequenceId &&
        currChapter?.resource.length === currentResource?.sequenceId
      ) {
        nextChap = course?.chapters[0];
        nextLesson = nextChap?.resource[0];
      }
      let progressData = {
        nextChap: nextChap,
        nextLesson: nextLesson,
      };

      return res.status(200).json({
        info: false,
        success: true,
        message: "course successfully fetched",
        courseDetails: course,

        latestProgress: progressData,
      });
    } else {
      console.log({
        nextChap: course?.chapters[0],
        nextLesson: course?.chapters[0].resource[0],
      });
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
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
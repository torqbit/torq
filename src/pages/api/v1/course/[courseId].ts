import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let cookieName = getCookieName();
  try {
    const { courseId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const userId = token?.id;
    const alreadyRegisterd = await prisma.courseRegistration.findFirst({
      where: {
        studentId: userId,
        courseId: Number(courseId),
      },

      select: {
        courseId: true,
        courseState: true,
      },
    });
    let chapterLessons: any[] = [];
    let courseName = "";
    let description = "";
    let trailerVidUrl = "";
    let resultRows: any[] = [];

    if (alreadyRegisterd && alreadyRegisterd.courseState == "COMPLETED") {
      resultRows = await prisma.$queryRaw<
        any[]
      >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName, 
        co.name as courseName, co.description, co.tvUrl,
        vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId, 
        ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
        INNER JOIN CourseRegistration as cr ON co.courseId = cr.courseId
        INNER JOIN Chapter as ch ON co.courseId = ch.courseId
        INNER JOIN Resource as re ON ch.chapterId = re.chapterId
        INNER JOIN Video as vi ON re.resourceId = vi.resourceId
        INNER JOIN CourseProgress as cp ON cp.user_id = cr.studentId AND cp.resourceId = re.resourceId
        WHERE cr.studentId = ${token?.id}
        AND co.courseId = ${courseId}
        ORDER BY chapterSeq, resourceSeq`;
    } else {
      resultRows = await prisma.$queryRaw<
        any[]
      >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.resourceId, re.name as lessonName, 
        co.name as courseName, co.description, co.tvUrl,
        vi.id as videoId, vi.videoUrl, vi.videoDuration, ch.chapterId, 
        ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
        INNER JOIN CourseRegistration as cr ON co.courseId = cr.courseId
        INNER JOIN Chapter as ch ON co.courseId = ch.courseId
        INNER JOIN Resource as re ON ch.chapterId = re.chapterId
        INNER JOIN Video as vi ON re.resourceId = vi.resourceId
        LEFT OUTER JOIN CourseProgress as cp ON cp.user_id = cr.studentId AND cp.resourceId = re.resourceId
        WHERE cr.studentId = ${token?.id}
        AND co.courseId = ${courseId}
        ORDER BY chapterSeq, resourceSeq`;
    }

    if (resultRows.length > 0) {
      courseName = resultRows[0].courseName;
      description = resultRows[0].description;
      trailerVidUrl = resultRows[0].tvUrl;
    }
    resultRows.forEach((r) => {
      if (chapterLessons.find((l) => l.chapterSeq == r.chapterSeq)) {
        const chapter = chapterLessons.find((l) => l.chapterSeq == r.chapterSeq);
        chapter.lessons.push({
          title: r.lessonName,
          videoDuration: r.videoDuration,
          lessonId: r.resourceId,
          isWatched: r.watchedRes != null,
        });
      } else {
        chapterLessons.push({
          chapterSeq: r.chapterSeq,
          chapterName: r.chapterName,
          lessons: [
            {
              title: r.lessonName,
              videoDuration: r.videoDuration,
              lessonId: r.resourceId,
              isWatched: r.watchedRes != null,
            },
          ],
        });
      }
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetched course lessons",
      course: { name: courseName, description: description, courseTrailer: trailerVidUrl },
      lessons: chapterLessons,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

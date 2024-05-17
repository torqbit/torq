import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;

    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const resultRows = await prisma.$queryRaw<
      any[]
    >`SELECT  ch.sequenceId as chapterSeq, re.sequenceId as resourceSeq, re.name as lessonName, vi.id as videoId, vi.videoUrl, ch.chapterId, 
    ch.name as chapterName, cp.resourceId as watchedRes FROM Course as co 
   INNER JOIN CourseRegistration as cr ON co.courseId = cr.courseId
   INNER JOIN Chapter as ch ON co.courseId = ch.courseId
   INNER JOIN Resource as re ON ch.chapterId = re.chapterId
   INNER JOIN Video as vi ON re.resourceId = vi.resourceId
   LEFT OUTER JOIN CourseProgress as cp ON cp.user_id = cr.studentId AND cp.resourceId = re.resourceId AND cp.chapterId = ch.chapterId
   WHERE cr.studentId = ${token?.id}
   AND co.courseId = ${courseId}
   ORDER BY chapterSeq, resourceSeq`;

    let chapterLessons: any[] = [];
    resultRows.forEach((r) => {
      if (chapterLessons.find((l) => l.chapterSeq == r.chapterSeq)) {
        const chapter = chapterLessons.find((l) => l.chapterSeq == r.chapterSeq);
        chapter.lessons.push({
          videoId: r.videoId,
          title: r.lessonName,
          videoUrl: r.videoUrl,
          isWatched: r.watchedRes != null,
        });
      } else {
        chapterLessons.push({
          chapterSeq: r.chapterSeq,
          chapterName: r.chapterName,
          lessons: [
            {
              videoId: r.videoId,
              title: r.lessonName,
              videoUrl: r.videoUrl,
              isWatched: r.watchedRes != null,
            },
          ],
        });
      }
    });

    console.log(chapterLessons);

    const course = await prisma.course.findUnique({
      where: {
        courseId: Number(courseId),
      },
      include: {
        chapters: {
          where: {
            courseId: Number(courseId),
            state: "ACTIVE",
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
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Fetched course lessons",
      lessons: chapterLessons,
    });
  } catch (error) {
    console.log(error)
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

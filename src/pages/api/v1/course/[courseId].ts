import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import getCourseDetail, { extractLessonAndChapterDetail } from "@/actions/getCourseDetail";
import { CourseState } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let cookieName = getCookieName();
  try {
    const { courseId } = req.query;

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const detail = await getCourseDetail(Number(courseId), token?.role, token?.id);

    if (detail?.courseDetail && detail?.courseDetail.length > 0) {
      const info = extractLessonAndChapterDetail(
        detail.courseDetail,
        detail?.userStatus as CourseState,
        detail.userRole
      );
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Fetched course lessons",
        course: { ...info.courseInfo, progress: info.progress },
        lessons: info.chapterLessons,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default handler;

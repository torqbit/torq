import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

/**
 * Post a query
 * @param req
 * @param res
 * @returns
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { lessonId, courseId, comment } = body;

    const isEnrolled = await prisma.courseRegistration.findFirst({
      where: {
        studentId: String(token?.id),
        courseId: Number(courseId),
      },
      select: {
        course: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (isEnrolled) {
      const addDiscussion = await prisma.discussion.create({
        data: {
          userId: String(token?.id),
          resourceId: lessonId,
          comment: comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      if (isEnrolled.course.user.id != token?.id) {
        await prisma.notification.create({
          data: {
            notificationType: "COMMENT",
            toUserId: isEnrolled.course.user.id,
            commentId: addDiscussion.id,
            fromUserId: String(token?.id) || "",
          },
        });
      }

      return res.status(200).json({ success: true, comment: addDiscussion });
    } else {
      return res.status(400).json({ success: false, error: "You are not enrolled to this course" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

/**
 * Post reply on a query
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
    const { lessonId, courseId, comment, parentCommentId } = body;

    const isEnrolled = await prisma.courseRegistration.findFirst({
      where: {
        studentId: String(token?.id),
        courseId: Number(courseId),
      },
    });

    if (isEnrolled) {
      const addDiscussion = await prisma.discussion.create({
        data: {
          userId: String(token?.id),
          resourceId: lessonId,
          comment: comment,
          parentCommentId: parentCommentId,
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
      const allthreadDiscussion = await prisma.discussion.findMany({
        distinct: ["userId"],

        where: {
          parentCommentId: parentCommentId,
          NOT: {
            userId: token?.id,
          },
        },
        select: {
          userId: true,
        },
      });

      allthreadDiscussion.map(async (user) => {
        return await prisma.notification.create({
          data: {
            notificationType: "COMMENT",
            toUserId: user.userId,
            commentId: addDiscussion.id,
            fromUserId: String(token?.id) || "",
            tagCommentId: parentCommentId,
          },
        });
      });

      return res.status(200).json({ success: true, comment: addDiscussion });
    } else {
      return res.status(400).json({ success: false, error: "You are not enrolled to this course" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

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
          parentCommentId: parentCommentId,
        },
      });
      const allthreadDiscussion = await prisma.discussion.findMany({
        distinct: ["userId"],
        where: {
          parentCommentId: parentCommentId,
        },
        select: {
          userId: true,
        },
      });

      allthreadDiscussion
        .filter((discussion) => discussion.userId != token?.id)
        .map(async (user) => {
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

      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: "You are not enrolled to this course" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

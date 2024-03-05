import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const getNotifi = async (userId: number) => {
  return await prisma.notification.findMany({
    where: {
      toUserId: userId,
      isView: false,
    },
    include: {
      comment: {
        select: {
          comment: true,
        },
      },
      resource: {
        include: {
          chapter: {
            select: {
              courseId: true,
            },
          },
        },
      },

      tagComment: {
        select: {
          comment: true,
          resource: {
            select: {
              resourceId: true,
              chapter: {
                select: {
                  courseId: true,
                  chapterId: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const notifications = await getNotifi(Number(req.query.toUserId));
    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

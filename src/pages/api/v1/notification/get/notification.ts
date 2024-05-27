import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

export const getNotifi = async (userId: string) => {
  return await prisma.notification.findMany({
    where: {
      toUserId: userId,
      NOT: {
        fromUserId: userId,
      },
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
      fromUser: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const notifications = token?.id && (await getNotifi(token?.id));

    if (notifications && notifications.length > 0) {
      return res.status(200).json({ success: true, notifications });
    } else {
      res.status(400).json({ success: false, error: "No notifications" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

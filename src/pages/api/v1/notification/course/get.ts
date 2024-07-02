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
    const { courseId } = req.query;
    const courseNotificationDetail = await prisma.courseNotification.findUnique({
      where: {
        email_courseId: {
          email: String(token?.email),
          courseId: Number(courseId),
        },
      },
      select: {
        mailSent: true,
      },
    });

    return res
      .status(200)
      .json({ success: true, mailSent: courseNotificationDetail ? true : false, courseNotificationDetail });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

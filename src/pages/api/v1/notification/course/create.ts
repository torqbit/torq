import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { courseId, email, isEmailVerified } = body;

    const isAlreadyNotified = await prisma.courseNotification.findUnique({
      where: {
        email_courseId: {
          email: email,
          courseId: Number(courseId),
        },
      },
    });
    if (isAlreadyNotified) {
      return res.status(400).json({ success: false, error: "You have already subscribed for the course launch." });
    } else {
      await prisma.courseNotification.create({
        data: {
          email: email,
          courseId: Number(courseId),
          mailSent: false,
          isEmailVerified: isEmailVerified,
        },
      });
      return res.status(200).json({
        success: true,
        message: "You will be notified once the course is launched.",
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default handler;

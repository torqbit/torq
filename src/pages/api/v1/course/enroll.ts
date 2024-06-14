import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { addDays, getCookieName } from "@/lib/utils";
import MailerService from "@/services/MailerService";

export const validateReqBody = z.object({
  courseId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { courseId } = body;

    // check is user Active

    if (!token || !token.isActive) {
      return res.status(400).json({
        success: false,
        error: " You don't have an active user",
      });
    }

    // check user already enrolled

    const alreadyEnrolled = await prisma.courseRegistration.findUnique({
      where: {
        studentId_courseId: {
          courseId: Number(courseId),
          studentId: String(token?.id),
        },
      },
      select: {
        registrationId: true,
      },
    });
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        error: "You have already enrolled in this course",
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
      select: {
        courseType: true,
        thumbnail: true,
        name: true,
        expiryInDays: true,
      },
    });
    let courseType = course?.courseType;

    if (course) {
      const expiryDate = addDays(Number(course.expiryInDays));

      // IF COURSE IS FREE

      if (courseType === "FREE") {
        await prisma.courseRegistration.create({
          data: {
            studentId: token.id,
            courseId: courseId,
            expireIn: expiryDate,
            courseState: "ENROLLED",
          },
        });

        const configData = {
          name: token.name,
          email: token.email,

          url: `${process.env.NEXTAUTH_URL}/courses/${courseId}`,
          course: {
            name: course.name,
            thumbnail: course.thumbnail,
          },
        };

        MailerService.sendMail("COURSE_ENROLMENT", configData).then((result) => {
          console.log(result.error);
        });

        return res.status(200).json({
          success: true,
          message: "Congratulations you have successfully enrolled this course",
        });
      }

      // IF COURSE IS PAID

      if (courseType === "PAID") {
        return res.status(400).json({
          success: false,
          error: "Paid course not configured",
        });
      }
    }
  } catch (error: any) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withAuthentication(handler)));

import prisma from "../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";
import * as z from "zod";
import { ICourseInfo } from "@/pages/add-course";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  name: z.string(),
  about: z.string(),
  description: z.object({}),
  thumbnail: z.string(),
  tags: z.array(z.string()),
  courseType: z.enum(["FREE", "PAID"]),
  userId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;

    // body data
    const { name, about, icon, description, thumbnail, tags, userId, courseType, coursePrice } = body as ICourseInfo;

    // check course already exist
    const isCourseExist = await prisma.course.findFirst({
      where: {
        name: name,
      },
      select: {
        name: true,
      },
    });

    if (isCourseExist) {
      return res.status(409).json({ success: false, error: "This course already exist" });
    }

    let courseData: any = {
      name,
      about,
      icon,
      description,
      thumbnail: thumbnail,
      authorId: Number(userId),
      tags: tags as string[],
      courseType: courseType,
    };

    if (coursePrice) courseData["coursePrice"] = Number(coursePrice);

    const newCourse = await prisma.course.create({
      data: courseData,
    });

    return res.status(200).json({ success: true, message: "New course created successfully", courseId: newCourse.courseId });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withUserAuthorized(handler)));

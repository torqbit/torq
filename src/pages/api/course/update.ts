import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";
import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { duration } from "moment";

export const validateReqBody = z.object({
  courseId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    // body data
    const {
      name,
      about,
      icon,
      description,
      thumbnail,
      tags,
      courseId,
      courseType,
      coursePrice,
      durationInMonths,
      state,
    } = body;

    // update course
    const updateObj: any = {};
    if (name) updateObj.name = name;
    if (about) updateObj.about = about;
    if (state) updateObj.state = state;

    if (description) updateObj.description = description;
    if (thumbnail) updateObj.thumbnail = thumbnail;
    if (durationInMonths) updateObj.durationInMonths = durationInMonths;

    if (tags) updateObj.tags = tags;

    if (icon) updateObj.icon = icon;
    if (courseType) updateObj.courseType = courseType;
    if (coursePrice) updateObj.coursePrice = Number(coursePrice);

    const updatedCourse = await prisma.course.update({
      where: {
        courseId: courseId,
      },
      data: updateObj,
    });
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(
  ["POST"],
  withValidation(validateReqBody, withUserAuthorized(handler))
);

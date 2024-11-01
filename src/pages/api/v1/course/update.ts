import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { createSlug } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    let courseId = Number(body.courseId);
    const findCourse = await prisma.course.findUnique({
      where: {
        courseId: body.courseId,
      },
    });

    if (findCourse) {
      let slug = `untitled-${new Date().getTime()}`;
      if (body.name && body.name != "Untitled") {
        slug = createSlug(body.name);
      }
      const updateCourse = await prisma.course.update({
        where: {
          courseId: Number(courseId),
        },
        data: {
          ...body,
          slug: slug,
        },
      });

      return res.status(200).json({
        info: false,
        success: true,
        message: "Course updated successfully",
        course: updateCourse,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

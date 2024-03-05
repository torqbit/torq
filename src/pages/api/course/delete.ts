import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  userId: z.number(),
  courseId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { courseId } = body;

    await prisma.course.delete({
      where: {
        courseId: courseId,
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(
  ["POST"],
  withValidation(validateReqBody, withUserAuthorized(handler))
);

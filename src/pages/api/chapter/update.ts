import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";
import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  chapterId: z.number(),
  name: z.string(),
  description: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, description, courseId, chapterId, objective } = body;
    const updateObj: any = {};

    if (name) updateObj.name = name;
    if (description) updateObj.description = description;
    if (courseId && !chapterId) updateObj.courseId = courseId;
    if (objective) updateObj.objective = objective;

    const newChapter = await prisma.chapter.update({
      where: {
        chapterId: chapterId,
      },
      data: updateObj,
    });

    return res.status(200).json({
      newChapter,
      success: true,
      message: "Chapter updated successfully",
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(
  ["POST"],
  withValidation(validateReqBody, withUserAuthorized(handler))
);

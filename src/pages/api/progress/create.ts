import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  resourceId: z.number(),
  sequenceId: z.number(),
  courseId: z.number(),
  chapterId: z.number(),

  userId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { resourceId, chapterId, userId, sequenceId, courseId } = body;
    console.log(body, "body of create mark as complete");
    const newProgress = await prisma.courseProgress.create({
      data: {
        courseId: Number(courseId),
        resourceId: resourceId,
        sequenceId: sequenceId,
        studentId: userId,
        chapterId: chapterId,
      },
    });

    return res.status(200).json({ success: true, message: "Resource updated successfully" });
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

export const validateReqBody = z.object({
  resourceId: z.number(),
  userId: z.number(),
  assignmentId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { resourceId, code, userId, assignmentId, chapterId, courseId } = body;

    const updateSubStatus = prisma.assignmentAndTask.update({
      where: {
        id: assignmentId,
      },
      data: {
        submissionStatus: "SUBMITTED",
      },
    });
    const newSubmission = prisma.submissionTask.create({
      data: {
        assignmentTaskId: assignmentId,
        userId: userId,
        assignmentId: resourceId,
        isEvaluated: false,
        content: code,
      },
    });

    const updateProgress = prisma.courseProgress.create({
      data: {
        resourceId: resourceId,
        courseId: courseId,
        studentId: userId,
      },
    });

    const transRes = await prisma.$transaction([newSubmission, updateSubStatus, updateProgress]);

    return res.status(200).json({ transRes, success: true, message: "Assignment Submitted" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withAuthentication(handler)));

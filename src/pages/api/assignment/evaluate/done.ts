import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";
import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import moment from "moment";

export const validateReqBody = z.object({
  evaluatedByUserId: z.number(),
  assignmentUserId: z.number(),
  assignmentId: z.number(),
  score: z.number(),
  submissionId: z.number(),
  isEvaluated: z.boolean(),
  assignmentTitle: z.string(),
  resourceId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { assignmentId, score, comment, submissionId, isEvaluated, evaluatedByUserId, assignmentTitle, assignmentUserId, resourceId } =
      body;

    let transRes;

    if (!isEvaluated) {
      const updateAssignStatus = prisma.assignmentAndTask.update({
        where: {
          id: assignmentId,
        },
        data: {
          submissionStatus: "EVALUATED",
        },
      });
      const updateSubmission = prisma.submissionTask.update({
        where: {
          id: submissionId,
        },
        data: {
          evaluatedByUserId: evaluatedByUserId,
          isEvaluated: true,
          evaluationComments: comment,
          score: Number(score),
          evaluatedOn: new Date(moment.now()),
        },
      });

      const addNotification = prisma.notification.create({
        data: {
          resourceId: resourceId,
          notificationType: "EVALUATE_ASSIGNMENT",
          toUserId: Number(assignmentUserId),
          title: "Assignment Evaluated",
          description: assignmentTitle,
          fromUserId: Number(evaluatedByUserId),
        },
      });

      transRes = await prisma.$transaction([updateAssignStatus, updateSubmission, addNotification]);
    } else {
      const updateSubmission = prisma.submissionTask.update({
        where: {
          id: submissionId,
        },
        data: {
          evaluationComments: comment,
          score: Number(score),
        },
      });

      const addNotification = prisma.notification.create({
        data: {
          resourceId: resourceId,
          notificationType: "EVALUATE_ASSIGNMENT",
          toUserId: Number(assignmentUserId),
          title: "Assignment Re-Evaluated",
          description: assignmentTitle,
          fromUserId: Number(evaluatedByUserId),
        },
      });

      transRes = await prisma.$transaction([updateSubmission, addNotification]);
    }

    return res.status(200).json({ transRes, success: true, message: "Assignment Evaluated" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withUserAuthorized(handler)));

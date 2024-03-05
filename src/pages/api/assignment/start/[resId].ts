import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import moment from "moment";
import * as z from "zod";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

export const validateReqBody = z.object({
  daysToSubmit: z.number(),
  userId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { resId } = req.query;
    const body = await req.body;
    const { daysToSubmit, userId } = body;
    const deadLine = moment().add(Number(daysToSubmit), "hours").format();

    const noOfAssignment = (await prisma.assignmentAndTask.count()) ?? 1;
    const assignmentStartInfo = await prisma.assignmentAndTask.create({
      data: {
        assignmentId: Number(resId),
        isStarted: true,
        userId: Number(userId),
        deadLine: new Date(deadLine),
        startedAt: new Date(moment.now()),
        sequenceNo: noOfAssignment,
      },
    });
    return res.status(200).json({ assignmentStartInfo, success: true, message: "Assignment Started" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withValidation(validateReqBody, handler)));

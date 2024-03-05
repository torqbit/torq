import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  resourceId: z.number(),
  sequenceId: z.number(),
  programId: z.number(),

  userId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { resourceId, userId, sequenceId, programId } = body;
    const newProgress = await prisma.courseProgress.create({
      data: {
        programId: Number(programId),
        resourceId: resourceId,
        sequenceId: sequenceId,
        studentId: userId,
      },
    });

    return res.status(200).json({ success: true, message: "Resource updated successfully" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));

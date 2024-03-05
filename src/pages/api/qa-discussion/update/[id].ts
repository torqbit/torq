import prisma from "../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  comment: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { comment } = body;
    const newComment = await prisma.discussion.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        comment,
      },
    });

    return res.status(200).json({ comment: newComment, success: true, message: "Comment Edited" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));

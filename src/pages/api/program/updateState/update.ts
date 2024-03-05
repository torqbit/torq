import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";
import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  programId: z.number(),
  state: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { state, programId } = body;

    const updateProgramState = await prisma.program.update({
      where: {
        id: programId,
      },
      data: {
        state: state,
      },
    });

    return res.status(200).json({
      updateProgramState,
      success: true,
      message: "Program Published successfully",
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withUserAuthorized(handler)));

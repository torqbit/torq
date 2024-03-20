import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chapterId, state } = req.body;
    const updateState = await prisma.chapter.update({
      where: {
        chapterId: Number(chapterId),
      },
      data: {
        state: state,
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "State updated",
      programs: updateState,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

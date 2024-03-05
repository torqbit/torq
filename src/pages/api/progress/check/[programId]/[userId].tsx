import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.query?.userId;
    const programId = req.query.programId
    const progress = await prisma.courseProgress.findMany({
      where: {
        studentId: Number(userId),
        programId:Number(programId)
      },
    });

    if (progress) {
      return res.status(200).json({
        success: true,
        progress: progress,
        messsage: "Found Progress",
      });
    } else {
      return res.status(400).json({
        success: true,
        progress: progress,
        messsage: "Not Found ",
      });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

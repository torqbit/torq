import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const courseId = req.query?.courseId;
    const userId = req.query?.userId;
    const progress = await prisma.courseProgress.findMany({
      where: {
        courseId: Number(courseId),
        studentId: String(userId),
      },
    });

    return res.status(200).json({ success: true, total: progress.length, messsage: "Found Progress" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

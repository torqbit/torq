import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, userId } = req.query;
    const assignmentInfo = await prisma.assignmentAndTask.findFirst({
      where: {
        assignmentId: Number(id),
        userId: Number(userId),
      },
    });
    return res.status(200).json({ success: true, assignmentInfo, messsage: "Found Assignment" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

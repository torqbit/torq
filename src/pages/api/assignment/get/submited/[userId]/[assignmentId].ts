import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId, assignmentId } = req.query;
    const submitedAssignment = await prisma.submissionTask.findFirst({
      where: {
        userId: Number(userId),
        assignmentId: Number(assignmentId),
      },
    });
    return res.status(200).json({ success: true, submitedAssignment, messsage: "Found Assignment" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

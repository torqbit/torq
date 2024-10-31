import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { assignmentId } = query;

    await prisma?.assignment.delete({
      where: {
        id: Number(assignmentId),
      },
    });

    return res.json({ success: true, message: "Assignment has been deleted" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));

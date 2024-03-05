import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {} = req.query;
    const allAssignment = await prisma.assignmentAndTask.findMany({
      where: {
        isStarted: true,
        NOT: [
          {
            submissionStatus: "PENDING",
          },
        ],
      },
      include: {
        resource: {
          select: {
            assignment: true,
            assignmentLang: true,
          },
        },
        submissionTask: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return res.status(200).json({ success: true, allAssignment, messsage: "Found Assignment" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

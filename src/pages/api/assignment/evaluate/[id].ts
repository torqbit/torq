import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const assignmentInfo = await prisma.assignmentAndTask.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        resource: {
          select: {
            name: true,
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
    });
    return res.status(200).json({ success: true, assignmentInfo, messsage: "Found Assignment" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

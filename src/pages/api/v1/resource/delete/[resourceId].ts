import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { resourceId } = req.query;
    const findResource = await prisma.resource.findUnique({
      where: {
        resourceId: Number(resourceId),
      },
    });

    if (findResource) {
      const [updateSeq, deleteCourse] = await prisma.$transaction([
        prisma.$executeRaw`UPDATE Resource SET sequenceId = sequenceId - 1  WHERE sequenceId > ${findResource.sequenceId}  AND  chapterId = ${findResource.chapterId};`,
        prisma.resource.delete({
          where: {
            resourceId: Number(resourceId),
          },
        }),
      ]);
      return res.status(200).json({
        info: false,
        success: true,
        message: "Resource Deleted",
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(handler));

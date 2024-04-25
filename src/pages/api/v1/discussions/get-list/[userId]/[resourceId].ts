import prisma from "../../../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Pagination
    const { pageSize, resourceId } = req.query;
    let pagination: any = {};

    if (pageSize) {
      pagination.take = Number(pageSize);
    }
    const total = await prisma.discussion.count({
      where: {
        resourceId: Number(resourceId),
        parentCommentId: null,
      },
    });
    const allComments = await prisma.discussion.findMany({
      where: {
        resourceId: Number(resourceId),
        parentCommentId: null,
      },
      ...pagination,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({ success: true, allComments: allComments, total });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

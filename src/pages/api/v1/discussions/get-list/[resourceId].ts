import prisma from "../../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
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
    const comments = await prisma.discussion.findMany({
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

    return res.status(200).json({ success: true, comments: comments, total });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

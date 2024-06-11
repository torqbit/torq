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

    const rawData = await prisma.$queryRaw<any[]>`
      select dis.id, dis.userId, name, image,  comment, updatedAt, 
COUNT(thread.reply_id) as replyCount FROM Discussion as dis
INNER JOIN User ON dis.userId = User.id
LEFT OUTER JOIN ( SELECT id as reply_id, parentCommentId FROM Discussion) as thread
ON dis.id = thread.parentCommentId
WHERE dis.parentCommentId is NULL AND dis.resourceId =${resourceId}
GROUP BY dis.id, userId, comment, dis.createdAt
 ORDER BY dis.createdAt DESC LIMIT ${pageSize};
  `;

    const comments = rawData.map((data) => {
      return {
        ...data,
        comment: data.comment,
        id: data.id,

        user: {
          id: data.userId,
          name: data.name,
          image: data.image,
        },
        updatedAt: data.updatedAt,
        replyCount: Number(data.replyCount),
      };
    });

    return res.status(200).json({ success: true, comments: comments, total });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

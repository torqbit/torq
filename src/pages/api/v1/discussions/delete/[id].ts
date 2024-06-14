import prisma from "../../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const queryReplyList = await prisma.discussion.findMany({
      where: {
        id: Number(req.query.id),
        parentCommentId: Number(req.query.id),
      },
    });

    if (queryReplyList.length > 0) {
      await prisma.discussion.deleteMany({
        where: {
          OR: [
            {
              parentCommentId: Number(req.query.id),
            },
            {
              id: Number(req.query.id),
            },
          ],
        },
      });
    } else {
      await prisma.discussion.delete({
        where: {
          id: Number(req.query.id),
        },
      });
    }

    return res.status(200).json({ success: true, message: "Comment has been deleted" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);

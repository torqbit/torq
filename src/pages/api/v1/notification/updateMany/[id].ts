import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getNotifi } from "../get/[toUserId]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const update = await prisma.notification.updateMany({
      where: {
        toUserId: Number(req.query.userId),
        tagCommentId: Number(req.query.id),
      },
      data: {
        isView: true,
      },
    });
    console.log(update, "d");
    const notifications = await getNotifi(Number(req.query.userId));
    return res.status(200).json({ notifications, success: true });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);

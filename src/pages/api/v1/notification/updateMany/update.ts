import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getNotifi } from "../get/notification";
import { getToken } from "next-auth/jwt";

import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const { tagCommentId } = req.body;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const userId = token?.id;
    const update = await prisma.notification.updateMany({
      where: {
        toUserId: userId,
        tagCommentId: Number(tagCommentId),
      },
      data: {
        isView: true,
      },
    });

    const notifications = token?.id && (await getNotifi(token?.id, 10000, 0));
    return res.status(200).json({ notifications, success: true });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

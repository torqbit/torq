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

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    await prisma.notification.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        isView: true,
      },
    });
    const notifications = token?.id && (await getNotifi(token?.id));
    return res.status(200).json({ notifications, success: true });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);

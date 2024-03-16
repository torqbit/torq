import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const getCheckNewOne = async (userId: number) => {
  return await prisma.notification.findMany({
    where: {
      toUserId: userId,
      isView: false,
    },
    select: {
      id: true,
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const notifications = await getCheckNewOne(Number(req.query.toUserId));

    return res.status(200).json({ success: true, isNew: notifications.length > 0 ? true : false });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

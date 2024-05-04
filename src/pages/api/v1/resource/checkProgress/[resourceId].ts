import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const { resourceId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = token?.id;

    const findProgress = await prisma.courseProgress.findFirst({
      where: {
        studentId: authorId,
        resourceId: Number(resourceId),
      },
    });

    if (findProgress) {
      return res.status(200).json({ success: true, completed: true });
    } else {
      return res.status(200).json({ success: true, completed: false });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

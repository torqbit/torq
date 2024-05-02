import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { StateType } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
export let cookieName = appConstant.development.cookieName;
if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { resourceId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = Number(token?.id);

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
    console.log(error, "d");
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

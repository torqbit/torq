import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let cookieName = getCookieName();

  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
    cookieName,
  });
  try {
    const resourceId = req.query?.resourceId;
    const userId = token?.id;
    const progress = await prisma.courseProgress.findFirst({
      where: {
        resourceId: Number(resourceId),
        studentId: userId,
      },
    });

    const isCompleted = progress ? true : false;
    return res.status(200).json({
      success: true,
      isCompleted: isCompleted,
      progressId: progress?.courseProgressId,
      messsage: "Found Resource",
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

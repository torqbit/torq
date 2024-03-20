import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import appConstant from "@/services/appConstant";
import { getToken } from "next-auth/jwt";

export let cookieName = appConstant.development.cookieName;

if (process.env.NODE_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const userId = Number(token?.id);
    const { id } = req.query;
    const assignment = await prisma.assignmentAndTask.findFirst({
      where: {
        assignmentId: Number(id),
        userId: userId,
      },
    });
    let deadline = new Date(`${assignment?.deadLine}`).getSeconds() - new Date(`${assignment?.startedAt}`).getSeconds();
    const end = Date.parse(`${assignment?.deadLine}`);
    const start = Date.parse(`${assignment?.startedAt}`);

    return res.status(200).json({
      info: false,
      success: true,
      message: "Assignment found",
      deadline: end,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { theme } = body;

    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: token?.id,
      },
      data: { theme: theme },
    });

    return res.status(200).json({ success: true, message: "User theme updated successfully" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

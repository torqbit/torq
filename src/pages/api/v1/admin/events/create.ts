import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const body = req.body;

    const createEvent = await prisma.events.create({
      data: {
        ...body,
        authorId: String(token?.id),
      },
      select: {
        id: true,
      },
    });

    return res.status(200).json({ success: true, message: "Event has been created" });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));

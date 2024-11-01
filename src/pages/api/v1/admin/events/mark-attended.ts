import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { createSlug, getCookieName } from "@/lib/utils";
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

    const { email, eventId } = req.body;

    await prisma.eventRegistration.update({
      where: {
        eventId_email: {
          email: email,
          eventId: eventId,
        },
      },

      data: {
        attended: true,
      },
    });

    return res.status(200).json({ success: true, message: "Mark as attended" });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));

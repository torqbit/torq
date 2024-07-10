import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { IFeedBackConfig } from "@/lib/emailConfig";
import MailerService from "@/services/MailerService";

/**
 * Post a conversation
 * @param req
 * @param res
 * @returns
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { feedback } = body;
    let config = {
      name: token?.name,
      email: token?.email,
      feedback: feedback,
    } as IFeedBackConfig;

    await MailerService.sendMail("FEEDBACK", config).then((result) => {
      if (result.error) {
        res.status(400).json({ success: false, error: result.error });
      } else {
        res.status(200).json({ success: true, message: "Mail has been sent to admin" });
      }
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

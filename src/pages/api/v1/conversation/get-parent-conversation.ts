import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

/**
 * Get all conversation
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

    const allConversation = await prisma.conversation.findMany({
      distinct: ["authorId"],
      where: {
        parentConversationId: null,
      },
      include: {
        user: {
          select: {
            image: true,
            name: true,
            id: true,
          },
        },
      },
    });
    if (allConversation.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "All conversation has been fetched", conversationList: allConversation });
    } else {
      return res.status(400).json({ success: false, error: "No conversation found" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

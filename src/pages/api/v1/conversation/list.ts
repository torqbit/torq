import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { error } from "console";

/**
 * Get all conversation
 * @param req
 * @param res
 * @returns
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { conversationId } = query;

    const allConversation = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            id: Number(conversationId),
            parentConversationId: null,
          },
          {
            parentConversationId: Number(conversationId),
          },
        ],
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
      return res.status(200).json({ success: true, message: "All conversation has been fetched", allConversation });
    } else {
      return res.status(400).json({ success: false, error: "No conversation found" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

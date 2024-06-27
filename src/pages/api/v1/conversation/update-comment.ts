import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

/**
 * Post a conversation
 * @param req
 * @param res
 * @returns
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { conversationId, authorId, comment } = await req.body;

    const updated = await prisma.conversation.update({
      where: {
        authorId: String(authorId),
        id: Number(conversationId),
      },
      data: {
        comment: comment,
      },
      select: {
        parentConversationId: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: updated.parentConversationId ? "reply has been updated" : "query has been updated",
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

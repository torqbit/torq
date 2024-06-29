import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

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
    const { comment, parentConversationId } = body;

    const isParentCommentExist = await prisma.conversation.findFirst({
      where: {
        id: Number(parentConversationId),
        parentConversationId: null,
      },
      select: {
        id: true,
        isView: true,
        authorId: true,
      },
    });
    if (!isParentCommentExist) {
      const queryPost = await prisma.conversation.create({
        data: {
          comment: comment,
          authorId: String(token?.id),
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

      return res.status(200).json({ success: true, message: "query has been posted", conversation: queryPost });
    } else {
      const replyPost = await prisma.conversation.create({
        data: {
          comment: comment,
          authorId: String(token?.id),
          parentConversationId: isParentCommentExist.id,
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

      if (isParentCommentExist.isView && isParentCommentExist.authorId !== String(token?.id)) {
        await prisma.conversation.update({
          where: {
            id: isParentCommentExist.id,
          },
          data: {
            isView: false,
          },
        });
      }

      return res.status(200).json({ success: true, message: "reply has been posted", conversation: replyPost });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

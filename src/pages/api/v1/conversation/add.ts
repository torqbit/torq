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
    const { comment } = body;

    const isParentCommentExist = await prisma.conversation.findFirst({
      where: {
        authorId: String(token?.id),
        parentConversationId: null,
      },
      select: {
        id: true,
        isView: true,
        authorId: true,
      },
    });
    if (!isParentCommentExist) {
      await prisma.conversation.create({
        data: {
          comment: comment,
          authorId: String(token?.id),
          parentConversationId: null,
        },
      });

      return res.status(200).json({ success: true, message: "query has been posted" });
    } else {
      await prisma.conversation.create({
        data: {
          comment: comment,
          authorId: String(token?.id),
          parentConversationId: isParentCommentExist.id,
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

      return res.status(200).json({ success: true, message: "reply has been posted" });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

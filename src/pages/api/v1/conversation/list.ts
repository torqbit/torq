import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { IConversationList } from "@/services/ConversationService";

/**
 * Get all conversation
 * @param req
 * @param res
 * @returns
 */

export interface IConversationData {
  name: string;
  id: number;
  image: string;
  authorId: string;
  comments: string[];
  isView: boolean;
}

export const groupContinuousComments = (comments: IConversationList[]) => {
  const newConversation: IConversationData[] = [];

  comments.forEach((conversation, i) => {
    if (i === 0) {
      newConversation.push({
        name: conversation.user.name,
        image: conversation.user.image,
        authorId: conversation.authorId,
        comments: [String(conversation.comment)],
        id: conversation.id,
        isView: conversation.isView,
      });
    } else {
      if (conversation.authorId === comments[i - 1].authorId) {
        newConversation[newConversation.length - 1].comments.push(String(conversation.comment));
      } else {
        newConversation.push({
          name: conversation.user.name,
          image: conversation.user.image,
          authorId: conversation.authorId,
          comments: [String(conversation.comment)],
          id: conversation.id,
          isView: conversation.isView,
        });
      }
    }
  });

  return newConversation;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const findConversation = await prisma.conversation.findFirst({
      where: {
        authorId: String(token?.id),
        parentConversationId: null,
      },
    });

    if (findConversation) {
      const allConversation = await prisma.conversation.findMany({
        where: {
          OR: [
            {
              id: findConversation.id,
              parentConversationId: null,
            },
            {
              parentConversationId: findConversation.id,
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
      const allData = groupContinuousComments(allConversation as IConversationList[]);

      if (allConversation.length > 0) {
        console.log(allData);
        return res.status(200).json({ success: true, message: "All conversation has been fetched", comments: allData });
      } else {
        return res.status(400).json({ success: false, error: "No conversation found" });
      }
    } else {
      return res.status(400).json({ success: false, error: "No conversation found" });
    }
  } catch (err) {
    console.log(err);
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

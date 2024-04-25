import prisma from "../../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const commentId = req.query?.cmtId;
    const comment = await prisma.discussion.findFirst({
      where: {
        id: Number(commentId),
      },
      include: {
        user: true,
      },
    });
    return res.status(200).json({ success: true, comment, messsage: "Comment Found" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

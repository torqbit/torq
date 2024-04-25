import prisma from "../../../../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allReplyCmts = await prisma.discussion.count({
      where: {
        parentCommentId: Number(req.query.parentCmtId),
      },
    });
    return res.status(200).json({ success: true, allReplyCmts: allReplyCmts });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

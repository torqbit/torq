import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const { authorId, state } = req.query;
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const { contentType } = req.query;
    const authorId = token?.id;
    const allBlog = await prisma.blog.findMany({
      orderBy: [{ createdAt: "asc" }],
      where: {
        authorId: authorId,
        contentType: String(contentType),
        state: "DRAFT",
        // state: state as StateType,
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "course Loaded",
      blog: allBlog.pop(),
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

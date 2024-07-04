import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { Course } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { blogId } = req.query;
    const blog = await prisma.blog.findUnique({
      where: {
        id: String(blogId),
      },
    });
    if (blog) {
      return res.status(200).json({ success: true, blog });
    } else {
      return res.status(400).json({ success: false, error: " Blog not exist" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { offSet, limit, filter, type } = req.query;
    if (filter) {
      const latestBlogs = await prisma.blog.findMany({
        take: Number(limit),
        skip: Number(offSet),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      if (latestBlogs) {
        return res.status(200).json({ success: true, latestBlogs: latestBlogs.filter((b) => b.type === type) });
      } else {
        return res.status(400).json({ success: false, error: "No Blog found" });
      }
    } else {
      const latestBlogs = await prisma.blog.findMany({
        where: {
          type: String(type),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      if (latestBlogs) {
        return res.status(200).json({ success: true, latestBlogs });
      } else {
        return res.status(400).json({ success: false, error: "No Blog found" });
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

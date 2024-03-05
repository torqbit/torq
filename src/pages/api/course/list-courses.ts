import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { pageNo, pageSize } = req.query;
    let pagination: any = {};

    let query: any = {
      isActive: true,
    };

    if (pageNo && pageSize) {
      pagination.skip = (Number(pageNo) - 1) * Number(pageSize);
      pagination.take = Number(pageSize);
    }

    const allCourses = await prisma.course.findMany({
      where: query,
      orderBy: {
        createdAt: "asc",
      },
      ...pagination,
    });
    return res.status(200).json({ success: true, allCourses });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

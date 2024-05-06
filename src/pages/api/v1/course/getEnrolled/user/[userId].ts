import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, pageNo, pageSize } = req.query;
  try {
    let pagination: any = {};

    let query: any = {
      isActive: true,
    };

    if (userId) {
      query.studentId = +userId;
    }

    if (pageNo && pageSize) {
      pagination.skip = +pageNo * +pageSize;
      pagination.take = pageSize;
    }

    const enrollCourses = await prisma.courseRegistration.findMany({
      where: query,
      include: {
        course: {
          include: {
            chapter: {
              where: {
                isActive: true,
              },
              include: {
                resource: {
                  where: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...pagination,
    });
    return res.status(200).json({ success: true, enrollCourses });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

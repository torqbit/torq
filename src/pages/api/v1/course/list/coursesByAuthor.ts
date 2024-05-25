import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allCourse = await prisma.course.findMany({
      select: {
        courseId: true,
        name: true,
        difficultyLevel: true,
        state: true,
        thumbnail: true,
        description: true,
        totalResources: true,
        user: {
          select: {
            name: true,
          },
        },
        chapters: {
          select: {
            resource: {
              select: {
                video: {
                  select: {
                    videoDuration: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "course successfully fetched",
      courses: allCourse,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

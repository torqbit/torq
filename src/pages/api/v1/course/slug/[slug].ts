import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { StateType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { slug } = req.query;
    const course = await prisma.course.findUnique({
      where: {
        slug: String(slug),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        chapters: {
          where: {
            state: StateType.ACTIVE,
          },
          include: {
            resource: {
              where: {
                state: StateType.ACTIVE,
              },
              include: {
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
      success: true,
      statusCode: 200,
      message: "Course details successfully fetched for the slug",
      courseDetails: course,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

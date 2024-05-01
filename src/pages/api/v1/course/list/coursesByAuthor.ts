import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { StateType } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
export let cookieName = appConstant.development.cookieName;
if (process.env.NODE_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const { authorId, state } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = token?.id;
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
      orderBy: [{ createdAt: "asc" }],
      where: {
        authorId: authorId,
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

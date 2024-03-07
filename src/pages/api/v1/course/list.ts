import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { Course } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { programId, state, isChapter } = req.query;

    let allCourse: Course[];
    if (isChapter === "true") {
      allCourse = await prisma.course.findMany({
        orderBy: [{ sequenceId: "asc" }],
        include: {
          chapter: {
            where: {
              isActive: true,
            },
          },
        },
      });
    } else {
      allCourse = await prisma.course.findMany({
        orderBy: [{ sequenceId: "asc" }],
        where: {
          isActive: true,
        },
      });
    }
    return res.status(200).json({
      info: false,
      success: true,
      message: "Crouse Loaded",
      allCourse: allCourse,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

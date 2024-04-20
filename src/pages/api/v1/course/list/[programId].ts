import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { programId, state } = req.query;
    const allCourse = await prisma.course.findMany({
      orderBy: [{ sequenceId: "asc" }],
      where: {
        programId: Number(programId),
        // state: state as StateType,
      },
      include: {
        chapter: {
          where: {
            isActive: true,
          },
        },
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "Courses Loaded",
      allCourse: allCourse,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    const allChapter = await prisma.chapter.findMany({
      orderBy: [{ sequenceId: "asc" }],
      where: {
        courseId: Number(courseId),
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "Crouse found",
      allChapter: allChapter,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

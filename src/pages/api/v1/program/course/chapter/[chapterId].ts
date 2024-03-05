import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chapterId } = req.query;
    const chapter = await prisma.chapter.findUnique({
      where: {
        chapterId: Number(chapterId),
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "Chapter found",
      chapter: chapter,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

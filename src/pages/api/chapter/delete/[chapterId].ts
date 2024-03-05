import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chapterId } = req.query;
    const newChapter = await prisma.chapter.update({
      where: {
        chapterId: Number(chapterId),
      },
      data: {
        isActive: false,
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withUserAuthorized(handler));

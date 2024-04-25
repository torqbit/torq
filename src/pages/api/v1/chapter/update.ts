import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, description, chapterId } = body;

    const findChapter = await prisma.chapter.findUnique({
      where: {
        chapterId: chapterId,
      },
    });
    if (findChapter) {
      const updatedChapter = await prisma.chapter.update({
        where: {
          chapterId: chapterId,
        },
        data: {
          name: name,
          description: description,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Chapter updated successfully",
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

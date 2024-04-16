import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, description, sequenceId, courseId } = body;

    // CHECK IS CHAPTER EXIST WITH THIS NAME
    const isChapterExist = await prisma.chapter.findFirst({
      where: {
        name: name,
        courseId: courseId,
      },
    });

    if (isChapterExist) {
      return res.status(403).json({
        info: true,
        success: false,
        message: `Chapter already exist with this name : ${name} `,
      });
    }

    const [updateCourse, createChapter] = await prisma.$transaction([
      prisma.$executeRaw`UPDATE Chapter SET sequenceId = sequenceId + 1  WHERE sequenceId >= ${sequenceId} AND courseId = ${courseId};`,
      prisma.chapter.create({
        data: {
          name: name,
          description: description,
          courseId: courseId,
          sequenceId: sequenceId,
          state: "DRAFT",
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Chapter added successfully",
      chapter: createChapter,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

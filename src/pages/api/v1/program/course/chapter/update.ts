import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, description, sequenceId, chapterId } = body;

    const findChapter = await prisma.chapter.findUnique({
      where: {
        chapterId: chapterId,
      },
    });
    if (findChapter) {
      if (findChapter.sequenceId === sequenceId) {
        const updatedChapter = await prisma.chapter.update({
          where: {
            chapterId: chapterId,
          },
          data: {
            name: name,
            description: description,
            sequenceId: sequenceId,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Chapter updated successfully",
      
        });
      } else if (findChapter.sequenceId > sequenceId) {
        const [updateSeq, updateChapter] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Chapter SET sequenceId = sequenceId + 1  WHERE sequenceId < ${findChapter.sequenceId} AND  sequenceId >= ${sequenceId} AND courseId = ${findChapter.courseId};`,
          prisma.chapter.update({
            where: {
              chapterId: Number(chapterId),
            },
            data: {
              name: name,
              description: description,
              sequenceId: sequenceId,
            },
          }),
        ]);

        return res.status(200).json({
          info: false,
          success: true,
          message: "Chapter updated successfully",
        });
      } else if (findChapter.sequenceId < sequenceId) {
        const [updateSeq, updateCourse] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Chapter SET sequenceId = sequenceId - 1  WHERE sequenceId <= ${sequenceId} AND sequenceId > ${findChapter.sequenceId} AND courseId = ${findChapter.courseId};`,
          prisma.chapter.update({
            where: {
              chapterId: Number(chapterId),
            },
            data: {
              name: name,
              description: description,
              sequenceId: sequenceId,
            },
          }),
        ]);

        return res.status(200).json({
          info: false,
          success: true,
          message: "Chapter updated successfully",
          course: updateCourse,
        });
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { ResourceContentType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const {
      name,
      description,
      assignmentLang,
      videoDuration,
      daysToSubmit,
      thumbnail,
      assignment,
      chapterId,
      sequenceId,
      contentType,
      content,
    } = body;

    // CHECK IS RESOURCE EXIST WITH THIS NAME
    const isResourceExist = await prisma.resource.findFirst({
      where: {
        AND: [{ name: name }, { chapterId: Number(chapterId) }],
      },
    });

    if (isResourceExist) {
      return res.status(403).json({
        info: true,
        success: false,
        message: `Resource already exist with this name : ${name} `,
      });
    }

    let resData = {
      chapterId: chapterId,
      name: name,
      description: description,
      videoDuration: Number(videoDuration),
      thumbnail: thumbnail,
      daysToSubmit: Number(daysToSubmit),
      assignment: assignment,
      sequenceId: sequenceId,
      contentType: contentType as ResourceContentType,
      content: content,
      assignmentLang: assignmentLang,
    };

    if (resData) {
      const [updateCourse, createResource] = await prisma.$transaction([
        prisma.$executeRaw`UPDATE Resource SET sequenceId = sequenceId + 1  WHERE sequenceId >= ${Number(
          resData.sequenceId
        )} AND chapterId = ${Number(resData.chapterId)};`,
        prisma.resource.create({
          data: resData,
        }),
      ]);

      return res.status(200).json({
        info: false,
        success: true,
        message: "Resource added successfully",
        resource: createResource,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

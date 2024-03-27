import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

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
      sequenceId,
      contentType,
      content,
      resourceId,
      videoId,
    } = body;
    let updateObj: any = {};

    if (name) updateObj["name"] = name;
    if (description) updateObj["description"] = description;
    if (assignmentLang) updateObj["assignmentLang"] = assignmentLang;
    if (videoDuration) updateObj["videoDuration"] = Number(videoDuration);
    if (daysToSubmit) updateObj["daysToSubmit"] = Number(daysToSubmit);
    if (assignment) updateObj["assignment"] = assignment;
    if (sequenceId) updateObj["sequenceId"] = sequenceId;
    if (thumbnail) updateObj["thumbnail"] = thumbnail;
    if (videoId) updateObj["videoId"] = videoId;

    if (contentType) updateObj["contentType"] = contentType;
    if (content) updateObj["content"] = content;
    if (resourceId) updateObj["resourceId"] = resourceId;

    const findResource = await prisma.resource.findUnique({
      where: {
        resourceId: resourceId,
      },
    });
    if (findResource) {
      if (findResource.sequenceId === sequenceId) {
        const updatedResource = await prisma.resource.update({
          where: {
            resourceId: resourceId,
          },
          data: {
            ...updateObj,
          },
        });
        return res.status(200).json({
          info: false,
          success: true,
          message: "Resource updated successfully",
          resource: updatedResource,
        });
      } else if (findResource.sequenceId > sequenceId) {
        const [updateSeq, UpdateResource] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Resource SET sequenceId = sequenceId + 1  WHERE sequenceId < ${findResource.sequenceId} AND  sequenceId >= ${sequenceId} AND chapterId = ${findResource.chapterId};`,
          prisma.resource.update({
            where: {
              resourceId: resourceId,
            },
            data: {
              ...updateObj,
            },
          }),
        ]);

        return res.status(200).json({
          info: false,
          success: true,
          message: "Resource updated successfully",
        });
      } else if (findResource.sequenceId < sequenceId) {
        const [updateSeq, UpdateResource] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Resource SET sequenceId = sequenceId - 1  WHERE sequenceId <= ${sequenceId} AND sequenceId > ${findResource.sequenceId} AND chapterId = ${findResource.chapterId};`,
          prisma.resource.update({
            where: {
              resourceId: resourceId,
            },
            data: {
              ...updateObj,
            },
          }),
        ]);

        return res.status(200).json({
          info: false,
          success: true,
          message: "Resource updated successfully",
        });
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

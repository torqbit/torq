import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

export const validateReqBody = z.object({
  name: z.string(),
  description: z.string(),
  videoDuration: z.number(),
  contentType: z.enum(["Video", "Assignment"]),
  userId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const {
      name,
      description,
      videoDuration,
      assignment,
      chapterId,
      content,
      userId,
      thumbnail,
      contentType,
      daysToSubmit,
      assignmentLang,
      sequenceId,
    } = body;

    const noOfResource =
      (await prisma.resource.count({
        where: {
          chapterId: Number(chapterId),
        },
      })) ?? 0;

    const newResource = await prisma.resource.create({
      data: {
        name,
        description,
        videoDuration,
        chapterId: Number(chapterId),
        sequenceId: sequenceId,
        daysToSubmit: daysToSubmit,
        thumbnail: thumbnail,
        contentType,
        content: content,
        assignmentLang,
      },
    });
    return res.status(200).json({
      newResource,
      success: true,
      message: "Resource created successfully",
    });
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withUserAuthorized(handler)));

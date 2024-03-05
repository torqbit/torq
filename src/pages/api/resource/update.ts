import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import getUserById from "@/actions/getUserById";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";

export const validateReqBody = z.object({
  resourceId: z.number(),
  userId: z.number(),
});
export let cookieName = appConstant.development.cookieName;
if (process.env.NODE_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const authorId = Number(token?.id);
    const body = await req.body;

    const {
      category,
      name,
      description,
      assignment,
      videoDuration,
      chapterId,
      sequenceId,
      content,
      userId,
      thumbnail,
      resourceId,
      assignmentLang,
      daysToSubmit,
    } = body;

    // check is user is authorized
    if (!token || token.role !== "AUTHOR") {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
    // check is user is authorized end

    const updateObj: any = {};

    if (name) updateObj.name = name;
    if (description) updateObj.description = description;
    if (assignment) updateObj.assignment = assignment;
    if (category) updateObj.category = category;
    if (videoDuration) updateObj.videoDuration = videoDuration;
    if (chapterId) updateObj.chapterId = chapterId;
    if (sequenceId) updateObj.sequenceId = sequenceId;
    if (content) updateObj.content = content;
    if (thumbnail) updateObj.thumbnail = thumbnail;
    if (daysToSubmit) updateObj.daysToSubmit = daysToSubmit;
    if (assignmentLang) updateObj.assignmentLang = assignmentLang;

    const newResource = await prisma.resource.update({
      where: {
        resourceId: resourceId,
      },
      data: updateObj,
    });

    return res.status(200).json({
      created: newResource,
      success: true,
      message: "Resource updated successfully",
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, handler));

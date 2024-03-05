import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { title, description, duration, state, thumbnailImg, programId, banner, aboutProgram } = body;

    let updateObj: any = {};

    if (title) updateObj["title"] = title;
    if (description) updateObj["description"] = description;
    if (duration) updateObj["durationInMonths"] = Number(duration);
    if (state) updateObj["state"] = state;
    if (thumbnailImg) updateObj["thumbnail"] = thumbnailImg;
    if (banner) updateObj["banner"] = banner;
    if (aboutProgram) updateObj["aboutProgram"] = aboutProgram;

    const updatedProgram = await prisma.program.update({
      where: {
        id: Number(programId),
      },
      data: {
        ...updateObj,
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "Program updated successfully",
      program: updatedProgram,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

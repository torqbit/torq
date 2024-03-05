import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { title, description, duration, state, thumbnailImg, authorId } = body;

    // CHECK IS PROGRAM EXIST WITH THIS NAME
    const isProgramExist = await prisma.program.findFirst({
      where: {
        title: title,
      },
    });

    if (isProgramExist) {
      return res.status(403).json({
        info: true,
        success: false,
        message: `Program already exist with this name : ${title} `,
      });
    }

    const addProgram = await prisma.program.create({
      data: {
        title: title,
        description: description,
        durationInMonths: Number(duration),
        thumbnail: thumbnailImg,
        state: state,
        authorId: authorId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Program added successfully",
      program: addProgram,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

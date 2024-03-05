import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import appConstant from "@/services/appConstant";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { getToken } from "next-auth/jwt";

export let cookieName = appConstant.development.cookieName;
if (process.env.NODE_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

// Important for NextJS!

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // read body data from request
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const authorId = Number(token?.id);
    const body = await req.body;
    const { title, description, duration, edit, state, programId, thumbnailImg } = body;

    if (edit === "false") {
      const findProgram = await prisma.program.findFirst({
        where: {
          title: title,
        },
      });
      if (findProgram) {
        return res.status(403).json({
          success: true,
          message: "Already exist",
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
        message: "Succesfully added the program",
        program: addProgram,
      });
    } else if (edit === "true") {
      const updateProgram = await prisma.program.update({
        where: {
          id: Number(programId),
        },
        data: {
          title: title,
          description: description,
          durationInMonths: Number(duration),
          thumbnail: thumbnailImg,
          state: state,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Succesfully updated the program",
        program: updateProgram,
      });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

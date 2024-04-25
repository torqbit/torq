import prisma from "@/lib/prisma";

import { NextApiResponse, NextApiRequest } from "next";
import appConstant from "@/services/appConstant";
import { readFieldWithFile, uploadFileToImgKit } from "../v1/discussions/add/[id]";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

export let cookieName = appConstant.development.cookieName;

// Important for NextJS!

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // read body data from request

    const { aboutProgram, programId, bannerImg } = await req.body;

    const findProgramAbout = await prisma.program.findUnique({
      where: {
        id: Number(programId),
      },
    });

    if (findProgramAbout?.aboutProgram === aboutProgram && findProgramAbout?.banner === bannerImg) {
      res.status(200).json({ success: true, message: "Already updated" });
    } else {
      if (bannerImg) {
        const updateProgram = await prisma.program.update({
          where: {
            id: Number(programId),
          },
          data: {
            aboutProgram: aboutProgram,
            banner: bannerImg,
          },
        });
        if (updateProgram) {
          return res.status(200).json({
            success: true,
            message: "Succesfully updated the program",
            updateProgram,
          });
        } else {
          return res.status(400).json({
            success: true,
            error: "No such Program Exist",
          });
        }
      } else {
        const updateProgram = await prisma.program.update({
          where: {
            id: Number(programId),
          },
          data: {
            aboutProgram: aboutProgram,
          },
        });
        if (updateProgram) {
          return res.status(200).json({
            success: true,
            message: "Succesfully updated the program",
            updateProgram,
          });
        } else {
          return res.status(400).json({
            success: true,
            error: "No such Program Exist",
          });
        }
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

import prisma from "@/lib/prisma";

import { NextApiResponse, NextApiRequest } from "next";
import appConstant from "@/services/appConstant";

export let cookieName = appConstant.development.cookieName;

export default async function getProgram(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { program } = req.query;

      if (program) {
        const getProgram = await prisma.program.findUnique({
          where: {
            id: Number(program),
          },
          include: {
            course: {
              where: {
                programId: Number(program),
              },
              include: {
                chapter: {
                  where: {
                    isActive: true,
                  },
                  include: {
                    resource: {},
                  },
                },
              },
            },
          },
        });

        if (getProgram) {
          return res.status(200).json({
            success: true,
            message: "Succesfully get the program",
            getProgram,
          });
        } else {
          return res.status(404).json({
            success: true,
            error: "No such Program Exist",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        body: "empty",
        error: "Something went wrong! please try again later",
      });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, error: "Method not allowed" });
  }
}

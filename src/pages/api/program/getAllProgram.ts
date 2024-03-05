import prisma from "@/lib/prisma";

import { NextApiResponse, NextApiRequest } from "next";
import appConstant from "@/services/appConstant";

export let cookieName = appConstant.development.cookieName;

export default async function getAllProgram(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const allProgram = await prisma.program.findMany({
        include: {
          course: {},
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "All program Loaded", allProgram });
    } catch (err) {
      return res.status(400).json({
        success: false,

        error: "Something went wrong! please try again later",
      });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, error: "Method not allowed" });
  }
}

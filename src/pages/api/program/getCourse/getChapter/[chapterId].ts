import prisma from "@/lib/prisma";

import { NextApiResponse, NextApiRequest } from "next";
import appConstant from "@/services/appConstant";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

export let cookieName = appConstant.development.cookieName;

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { chapterId } = req.query;

    if (chapterId) {
      const getChapter = await prisma.chapter.findUnique({
        where: {
          chapterId: Number(chapterId),
        },
        include: {
          resource: {
            where: {
              chapterId: Number(chapterId),
            },
          },
        },
      });

      if (getChapter) {
        return res.status(200).json({
          success: true,
          message: "Succesfully get the course",
          getChapter,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "No course", getChapter });
      }
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      body: "empty",
      error: "Something went wrong! please try again later",
    });
  }
}

export default withMethods(["GET"], withUserAuthorized(handler));

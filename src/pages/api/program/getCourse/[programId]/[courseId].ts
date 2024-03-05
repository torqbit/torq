import prisma from "@/lib/prisma";

import { NextApiResponse, NextApiRequest } from "next";
import appConstant from "@/services/appConstant";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

export let cookieName = appConstant.development.cookieName;

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { courseId, programId } = req.query;

    if (courseId) {
      const getCourse = await prisma.course.findFirst({
        where: {
          courseId: Number(courseId),
          programId: Number(programId),
        },
        include: {
          chapter: {
            where: {
              courseId: Number(courseId),
              isActive: true,
            },
            include: {
              resource: {},
            },
          },
        },
      });

      if (getCourse) {
        return res.status(200).json({
          success: true,
          message: "Succesfully get the course",
          getCourse,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "course not found", getCourse });
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

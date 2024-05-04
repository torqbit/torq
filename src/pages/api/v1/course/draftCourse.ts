import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import { getToken } from "next-auth/jwt";

import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = token?.id;
    const body = await req.body;
    const { id } = body;

    // CHECK IF COURSE EXIST WITH THIS NAME
    if (id) {
      const isCourseExist = await prisma.course.findUnique({
        where: {
          courseId: id,
        },
      });
      if (isCourseExist) {
        return res.status(400).json({
          info: true,
          success: false,
          message: `Course already exist `,
        });
      }
    }

    let response = await prisma.course.create({
      data: {
        name: "Untitled",
        description: "Description about the Untitled Course",
        durationInMonths: 1,
        thumbnail: "",
        state: "DRAFT",
        authorId: authorId || "",
        skills: [],
        about: "",
        sequenceId: 0,
        icon: "",
      },
    });
    return res.status(201).json({
      success: true,
      message: "Draft course created",
      getCourse: response,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";

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
    const { id } = body;

    // CHECK IS COURSE EXIST WITH THIS NAME
    if (id) {
      const isCrouseExist = await prisma.course.findUnique({
        where: {
          courseId: id,
        },
      });
      if (isCrouseExist) {
        return res.status(403).json({
          info: true,
          success: false,
          message: `Crouse already exist `,
        });
      }
    }

    let courseData = {
      name: "",
      description: "",
      durationInMonths: 0,
      thumbnail: "",
      state: "DRAFT",
      authorId: authorId,
      skills: [],
      about: "",
      sequenceId: 0,
      icon: "",
    };

    const [updateCourse, draftCourse] = await prisma.$transaction([
      prisma.$executeRaw`UPDATE Course SET sequenceId = sequenceId + 1  WHERE sequenceId >= ${courseData.sequenceId};`,
      prisma.course.create({
        data: {
          name: "",
          description: "",
          durationInMonths: 0,
          thumbnail: "",
          state: "DRAFT",
          authorId: authorId,
          skills: [],
          about: "",
          sequenceId: 0,
          icon: "",
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Draft course added ",
      getCourse: draftCourse,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

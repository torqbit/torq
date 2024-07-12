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
    const body = await req.body;
    const { name, duration, state, skills, description, thumbnail, sequenceId, previewMode } = body;
    const findeTotalCourse = await prisma.course.findMany({
      where: {
        authorId: token?.id,
      },
    });

    let courseData = {
      name: name,
      description: description,
      durationInMonths: Number(duration),
      thumbnail: thumbnail,
      state: state,
      authorId: token?.id || "",
      skills: skills,
      about: "",
      sequenceId: findeTotalCourse.length + 1,
      previewMode: true,
    };

    const createCourse = await prisma.course.create({
      data: { ...courseData, icon: "" },
    });

    return res.status(200).json({
      success: true,
      message: "Course added successfully",
      course: createCourse,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import appConstant from "@/services/appConstant";
import { getToken } from "next-auth/jwt";

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
    const body = await req.body;
    const { name, duration, state, skills, description, thumbnail, sequenceId } = body;
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

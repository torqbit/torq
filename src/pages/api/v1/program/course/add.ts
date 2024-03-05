import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, duration, state, skills, description, thumbnail, programId, authorId, sequenceId } = body;

    // CHECK IS COURSE EXIST WITH THIS NAME
    const isCrouseExist = await prisma.course.findFirst({
      where: {
        name: name,
        programId: programId,
      },
    });

    if (isCrouseExist) {
      return res.status(403).json({
        info: true,
        success: false,
        message: `Crouse already exist with this name : ${name} `,
      });
    }

    let courseData = {
      programId: programId,
      name: name,
      description: description,
      durationInMonths: Number(duration),
      thumbnail: thumbnail,
      state: state,
      authorId: authorId,
      skills: skills,
      about: "",
      sequenceId: sequenceId,
    };

    const [updateCourse, createCourse] = await prisma.$transaction([
      prisma.$executeRaw`UPDATE Course SET sequenceId = sequenceId + 1  WHERE sequenceId >= ${courseData.sequenceId} AND programId = ${courseData.programId};`,
      prisma.course.create({
        data: { ...courseData, icon: "" },
      }),
    ]);

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

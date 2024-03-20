import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { StateType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("hit");
  try {
    console.log("it");

    const body = await req.body;
    const {
      name,
      duration,
      state,
      skills,
      description,
      thumbnail,
      sequenceId,
      courseId,
      thumbnailId,
      videoUrl,
      videoId,
    } = body;
    console.log(body, "body");

    let updateObj: any = {};

    if (name) updateObj["name"] = name;
    if (duration) updateObj["durationInMonths"] = Number(duration);
    if (state) updateObj["state"] = state as StateType;
    if (skills) updateObj["skills"] = skills;
    if (description) updateObj["description"] = description;
    if (thumbnail) updateObj["thumbnail"] = thumbnail;
    if (thumbnailId) updateObj["thumbnailId"] = thumbnail;
    if (videoUrl) updateObj["videoUrl"] = videoUrl;
    if (videoId) updateObj["videoId"] = videoId;

    if (sequenceId) updateObj["sequenceId"] = sequenceId;

    const findCourse = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
    });

    if (findCourse) {
      if (findCourse?.sequenceId === sequenceId) {
        const updateCourse = await prisma.course.update({
          where: {
            courseId: Number(courseId),
          },
          data: {
            ...updateObj,
            about: "",
          },
        });

        return res.status(200).json({
          info: false,
          success: true,
          message: "Course updated successfully",
          course: updateCourse,
        });
      } else if (findCourse?.sequenceId && findCourse.sequenceId > sequenceId) {
        const [updateSeq, updateCourse] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Course SET sequenceId = sequenceId + 1  WHERE sequenceId < ${findCourse.sequenceId} AND  sequenceId >= ${sequenceId};`,
          prisma.course.update({
            where: {
              courseId: Number(courseId),
            },
            data: {
              ...updateObj,
              about: "",
            },
          }),
        ]);

        return res.status(200).json({
          info: false,
          success: true,
          message: "Course updated successfully",
          course: updateCourse,
        });
      } else if (findCourse.sequenceId && findCourse.sequenceId < sequenceId) {
        const [updateSeq, updateCourse] = await prisma.$transaction([
          prisma.$executeRaw`UPDATE Course SET sequenceId = sequenceId - 1  WHERE sequenceId <= ${sequenceId} AND sequenceId > ${findCourse.sequenceId};`,
          prisma.course.update({
            where: {
              courseId: Number(courseId),
            },
            data: {
              ...updateObj,
              about: "",
            },
          }),
        ]);
        return res.status(200).json({
          info: false,
          success: true,
          message: "Course updated successfully",
          course: updateCourse,
        });
      } else {
        console.log("hit");
        const updateCourse = await prisma.course.update({
          where: {
            courseId: Number(courseId),
          },
          data: {
            ...updateObj,
            about: "",
          },
        });

        return res.status(200).json({
          info: false,
          success: true,
          message: "Course updated successfully",
          course: updateCourse,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

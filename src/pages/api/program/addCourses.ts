import prisma from "@/lib/prisma";

import { NextApiResponse, NextApiRequest } from "next";
import appConstant from "@/services/appConstant";
import { readFieldWithFile, uploadFileToImgKit } from "../v1/discussions/add/[id]";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { ICourse, ICourseList } from "@/components/programs/AddOverview";
import { getToken } from "next-auth/jwt";
import { error } from "console";
import { StateType } from "@prisma/client";
import { IResource } from "@/pages/learn/program/[programId]";

export let cookieName = appConstant.development.cookieName;
if (process.env.NODE_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

// Important for NextJS!

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = Number(token?.id);

    const body = await req.body;
    const { courses, programId } = body;

    if (courses[0].courseTitle !== "" && courses[0].courseTags.length >= 1) {
      const allCourses = courses.map(async (course: ICourse) => {
        const courseExist = await prisma.course.findFirst({
          where: {
            programId: programId,
            name: course.courseTitle,
          },
        });
        if (!courseExist && course.courseTitle !== "" && course.courseTags.length >= 1) {
          let courseCreated = await prisma.course.create({
            data: {
              programId: Number(programId),
              name: course.courseTitle,
              description: course.courseDescription,
              durationInMonths: Number(course.courseMonth),
              skills: course.courseTags,
              thumbnail: "",
              about: "",
              authorId: authorId,
              state: course.state as StateType,
              sequenceId: course.sequenceId,
            },
          });

          if (courseCreated) {
            course.chapters.map(async (chapter) => {
              const addChapter = await prisma.chapter.create({
                data: {
                  courseId: courseCreated.courseId,
                  objective: "",
                  name: chapter.name,
                  description: chapter.description,
                  sequenceId: chapter.sequenceId,
                },
              });
              if (addChapter) {
                chapter.resources.map(async (resource, i) => {
                  await prisma.resource.create({
                    data: {
                      chapterId: addChapter.chapterId,
                      name: resource.resourceTitle,
                      description: resource.resourceDescripton,
                      assignmentLang: resource.languages,
                      videoDuration: Number(resource.videoDuration),
                      daysToSubmit: Number(resource.submitDay),
                      thumbnail: resource.videoUrl,
                      assignment: [],
                      sequenceId: resource.sequenceId,
                      contentType: resource.contentType as any,
                      content: resource.content,
                    },
                  });
                });
              }
            });
          }
        }
      });

      return res.status(200).json({
        success: true,
        message: "successfully added the courses",
        allCourses,
      });
    } else {
      return res.status(400).json({ success: true, error: "Please add a course first" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import withValidation from "@/lib/api-middlewares/with-validation";

import * as z from "zod";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

// export const validateReqBody = z.object({
//   name: z.string(),
//   description: z.object({}),
//   courseId: z.number(),
//   userId: z.number(),
// });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;

    const { name, description, courseId, sequenceId, resource } = body;

    if (body) {
      const chapterExist = await prisma.chapter.findFirst({
        where: {
          courseId: Number(courseId),
          name: name,
        },
      });

      if (!chapterExist) {
        const newChapter = await prisma.chapter.create({
          data: {
            name,
            description,
            courseId,
            sequenceId,
          },
        });

        if (newChapter) {
          resource.map(async (resource: any) => {
            const newResource = await prisma.resource.create({
              data: {
                chapterId: newChapter.chapterId,
                name: resource.resourceTitle,
                description: resource.resourceDescripton,
                assignmentLang: resource.languages,
                videoDuration: Number(resource.videoDuration),
                daysToSubmit: Number(resource.submitDay),
                thumbnail: "",
                assignment: [],
                sequenceId: resource.sequenceId,
                contentType: resource.contentType as any,
                content: resource.content,
              },
            });
          });
        }
        return res.status(200).json({
          chapter: newChapter,
          success: true,
          message: "Chapter created successfully",
        });
      } else if (chapterExist) {
        return res.status(200).json({
          success: true,
          message: "Chapter already created",
        });
      }
    } else {
      return res.status(400).json({ success: false, error: "body empty" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

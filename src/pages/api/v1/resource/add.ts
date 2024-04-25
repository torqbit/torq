import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { ResourceContentType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, description, chapterId, contentType } = body;

    const resourceCount = await prisma.resource.count({
      where: {
        chapterId: chapterId,
      },
    });

    let resData = {
      chapterId: chapterId,
      name: name,
      description: description,
      sequenceId: resourceCount + 1,
      contentType: contentType as ResourceContentType,
    };

    const courseDetails = await prisma.chapter.findFirst({
      where: {
        chapterId: chapterId,
      },
      include: {
        course: {
          select: {
            courseId: true,
            totalResources: true,
          },
        },
      },
    });

    if (courseDetails) {
      const createResource = await prisma.resource.create({
        data: resData,
      });

      const updateCourse = await prisma.course.update({
        where: {
          courseId: courseDetails.course.courseId,
        },
        data: {
          totalResources: courseDetails.course.totalResources + 1,
        },
      });

      return res.status(201).json({
        info: false,
        success: true,
        message: "Resource added successfully",
        resource: createResource,
      });
    } else {
      return res.status(400).json({
        error: "Failed to find the course for which lesson is being added",
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { ResourceContentType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, description, chapterId, contentType, courseId } = body;
    // CHECK IS RESOURCE EXIST WITH THIS NAME
    const isResourceExist = await prisma.resource.findFirst({
      where: {
        AND: [{ name: name }, { chapterId: Number(chapterId) }],
      },
    });

    if (isResourceExist) {
      return res.status(403).json({
        info: true,
        success: false,
        message: `Resource already exist with this name : ${name} `,
      });
    }

    let resData = {
      chapterId: chapterId,
      name: name,
      description: description,
      sequenceId: ((await prisma.resource.count()) + 1) | 1,
      contentType: contentType as ResourceContentType,
    };

    const findCourse = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
    });

    if (resData) {
      const createResource = await prisma.resource.create({
        data: resData,
      });

      const updateCourse = await prisma.course.update({
        where: {
          courseId: courseId,
        },
        data: {
          totalResources: findCourse?.totalResources ? findCourse?.totalResources + 1 : 1,
        },
      });

      return res.status(200).json({
        info: false,
        success: true,
        message: "Resource added successfully",
        resource: createResource,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

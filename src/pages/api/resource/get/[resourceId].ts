import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const resource = await prisma.resource.findFirst({
      where: {
        resourceId: Number(req.query.resourceId),
        isActive: true,
      },
    });
    if (resource) {
      const chapter = await prisma.chapter.findFirst({
        where: {
          chapterId: resource.chapterId,
        },
        include: {
          resource: {},
        },
      });

      if (chapter) {
        const course = await prisma.course.findFirst({
          where: {
            courseId: chapter.courseId,
          },
          include: {
            chapter: {
              include: {
                resource: {},
              },
            },
          },
        });
        return res.status(200).json({ success: true, message: "Found Resource", resource, chapter, course });
      }
    } else if (!resource) {
      return res.json({ status: 400, success: false, error: "Resource Not Found" });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

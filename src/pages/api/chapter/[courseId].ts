import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const courseId = req.query?.courseId;
    const chapters = await prisma.chapter.findMany({
      where: {
        courseId: Number(courseId),
        isActive: true,
      },

      include: {
        resource: {
          where: {
            isActive: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, chapters, messsage: "Found Chapters" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

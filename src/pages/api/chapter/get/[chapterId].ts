import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const chapterId = req.query?.chapterId;
    const chapter = await prisma.chapter.findUnique({
      where: {
        chapterId: Number(chapterId),
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
    return res.status(200).json({ success: true, chapter, messsage: "Found Chapters" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

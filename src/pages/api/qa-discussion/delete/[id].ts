import prisma from "../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { imagekit } from "../add/[id]";
import { IAttachedFiles } from "@/components/LearnCourse/AboutCourse/CourseDiscussion/CommentBox";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const comment = await prisma.discussion.findFirst({
      where: {
        id: Number(req.query.id),
      },
    });

    const attachedFile: IAttachedFiles[] = comment?.attachedFiles as any[];

    if (attachedFile && attachedFile?.length) {
      const allPromise = attachedFile.map((file) => {
        return new Promise(async (resolve, reject) => {
          const res = await imagekit.deleteFile(file?.fileId);
          resolve({});
        });
      });

      await Promise.all(allPromise);
    }

    const deletedCmt = await prisma.discussion.delete({
      where: {
        id: Number(req.query.id),
      },
    });
    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);

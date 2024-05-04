import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import formidable, { IncomingForm } from "formidable";
import ImageKit from "imagekit";
import fs from "fs";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import appConstant from "@/services/appConstant";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

// Important for NextJS!
export const config = {
  api: {
    bodyParser: false,
  },
};

interface ICommentData {
  comment: string;
  userId: string;
  resourceId: number;
  attachedFiles: { fileCaption: string; upFiles: Array<{ url: string; fileId: string }> };
  parentCommentId?: number;
  tagCommentId?: number;
  caption?: string;
}

// read file from request
export const readFieldWithFile = (req: NextApiRequest) => {
  const form = new IncomingForm({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
// create instance of ImageKit
export const imagekit = new ImageKit({
  urlEndpoint: process.env.IKIT_URL_ENDPOINT as string,
  publicKey: process.env.IKIT_PUBLIC_KEY as string,
  privateKey: process.env.IKIT_PRIVATE_KEY as string,
});

export const uploadFileToImgKit = async (file: formidable.File, folder: string) => {
  const fileData = fs.readFileSync(file.filepath);
  const base64Data = fileData.toString("base64");
  return await imagekit.upload({
    file: base64Data,
    fileName: file?.originalFilename as string,
    useUniqueFileName: true,
    overwriteFile: true,
    folder: folder,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const userId = token?.id;
    // read file from request
    const { fields, files } = (await readFieldWithFile(req)) as any;
    // Comment Data
    const { comment, resourceId, parentCommentId, tagCommentId, caption } = fields;
    const resourceDetail = await prisma.resource.findUnique({
      where: {
        resourceId: Number(resourceId),
      },
      include: {
        chapter: {
          select: {
            courseId: true,
          },
        },
      },
    });
    const isEnrolled = await prisma.courseRegistration.findFirst({
      where: {
        courseId: resourceDetail?.chapter.courseId,
        studentId: userId,
        expireIn: {
          gte: new Date(),
        },
      },
      include: {
        course: {
          select: { authorId: true },
        },
      },
    });

    if (isEnrolled) {
      const upFiles: Array<{ url: string; fileId: string }> = [];

      if (files?.files) {
        if (files?.files?.length) {
          const allPromise = files.files.map((file: formidable.File) => {
            return new Promise(async (resolve, reject) => {
              const res = await uploadFileToImgKit(file, appConstant.attachmentFileFolder);
              upFiles.push({ url: res.url, fileId: res.fileId });
              resolve({});
            });
          });
          await Promise.all(allPromise);
        } else {
          const res = await uploadFileToImgKit(files.files, appConstant.attachmentFileFolder);
          upFiles.push({ url: res.url, fileId: res.fileId });
        }
      }

      const commentData: ICommentData = {
        comment: comment[0],
        userId: userId || "0",
        resourceId: Number(resourceId),
        attachedFiles: { fileCaption: caption[0], upFiles: upFiles },
      };

      if (parentCommentId && parentCommentId !== "undefined") commentData["parentCommentId"] = Number(parentCommentId);
      if (tagCommentId && tagCommentId !== "undefined") commentData["tagCommentId"] = Number(tagCommentId);

      //if (caption && caption !== "undefined") commentData["caption"] = caption;

      const newComment = await prisma.discussion.create({
        data: commentData,
      });
      const commentAuthor = newComment.userId;
      let courseAuthorId = isEnrolled.course.authorId;

      const getAllDiscussion = await prisma.discussion.findMany({
        distinct: ["userId"],

        where: {
          parentCommentId: newComment.parentCommentId,
        },
        select: {
          userId: true,
        },
      });
      let allUsers = getAllDiscussion
        .map((d) => d.userId)
        .concat([courseAuthorId])
        .filter((id) => id !== userId);
      console.log(allUsers, "all users");
      if (commentData?.parentCommentId) {
        allUsers.forEach(async (id) => {
          await prisma.notification.create({
            data: {
              notificationType: "COMMENT",
              toUserId: id,
              commentId: newComment.id,
              fromUserId: userId || "",
              tagCommentId: commentData.parentCommentId,
            },
          });
        });
      }

      return res.status(200).json({ success: true, newComment });
    } else {
      return res.status(400).json({ success: false, error: "You are not enrolled to this course" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

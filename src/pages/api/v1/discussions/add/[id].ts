import prisma from "../../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import formidable, { IncomingForm } from "formidable";
import ImageKit from "imagekit";
import fs from "fs";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import appConstant from "@/services/appConstant";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

// Important for NextJS!
export const config = {
  api: {
    bodyParser: false,
  },
};

interface ICommentData {
  comment: string;
  userId: number;
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
    // read file from request
    const { fields, files } = (await readFieldWithFile(req)) as any;

    // Comment Data
    const { comment, resourceId, parentCommentId, tagCommentId, caption, toUserId } = fields;
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
      userId: Number(req.query.id),
      resourceId: Number(resourceId),
      attachedFiles: { fileCaption: caption[0], upFiles: upFiles },
    };

    if (parentCommentId && parentCommentId !== "undefined") commentData["parentCommentId"] = Number(parentCommentId);
    if (tagCommentId && tagCommentId !== "undefined") commentData["tagCommentId"] = Number(tagCommentId);
    //if (caption && caption !== "undefined") commentData["caption"] = caption;

    const newComment = await prisma.discussion.create({
      data: commentData,
    });
    if (commentData?.parentCommentId) {
      const newNotification = await prisma.notification.create({
        data: {
          notificationType: "COMMENT",
          toUserId: Number(toUserId),
          commentId: newComment.id,
          fromUserId: Number(req.query.id),
          tagCommentId: commentData.parentCommentId,
        },
      });
    }
    return res.status(200).json({ success: true, newComment });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

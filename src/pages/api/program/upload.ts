import prisma from "@/lib/prisma";
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
  attachedFiles: Array<{ url: string }>;
  parentCommentId?: number;
  tagCommentId?: number;
  caption?: string;
}

// read file from request
export const readFile = (req: NextApiRequest) => {
  const form = new IncomingForm({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, file) => {
      if (err) reject(err);
      resolve({ file });
    });
  });
};
// create instance of ImageKit
export const imagekit = new ImageKit({
  urlEndpoint: process.env.IKIT_URL_ENDPOINT as string,
  publicKey: process.env.IKIT_PUBLIC_KEY as string,
  privateKey: process.env.IKIT_PRIVATE_KEY as string,
});

export const uploadFileToImgKit = async (
  file: formidable.File,
  folder: string
) => {
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
    const { file } = (await readFile(req)) as any;
    // Comment Data

    return res.status(200).json({ success: true });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

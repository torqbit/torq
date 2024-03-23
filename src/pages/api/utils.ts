import formidable, { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import ImageKit from "imagekit";
import { uploadVideo } from "./v1/upload/video/method";
import fs from "fs";

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

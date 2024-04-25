import { NextApiResponse, NextApiRequest } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import path from "path";

import { readFieldWithFile } from "@/pages/api/utils";
import fs from "fs";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { UploadVideoObjectType, VideoAPIResponse } from "@/types/courses/Course";

export const config = {
  api: {
    bodyParser: false,
  },
};
const cms = new ContentManagementService();
export function getFileExtension(fileName: string) {
  const parts = fileName.split(".");

  const extension = parts[parts.length - 1];

  return extension.toLowerCase();
}

export const saveToDir = async (fullName: string, sourcePath: string) => {
  const destinationPath = path.join("public/resource", fullName);

  fs.copyFileSync(sourcePath, destinationPath);

  fs.unlinkSync(sourcePath);
  return destinationPath;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files.file) {
      let path: string = "";
      const name = fields.title[0].replaceAll(" ", "_");
      const objectId = Number(fields.objectId[0]);
      const objectType = fields.objectType[0] as UploadVideoObjectType;
      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      const fullName = `${name.replace(/\s+/g, "-")}-${currentTime}.${extension}`;
      const videoUploadResponse = await saveToDir(fullName, sourcePath)
        .then((v) => {
          path = v;
          return fs.promises.readFile(v);
        })
        .then((fileBuffer) => {
          return prisma?.serviceProvider
            .findFirst({
              where: {
                service_type: "media",
              },
            })
            .then((provider: any) => {
              if (provider?.provider_name) {
                const serviceProvider = cms.getServiceProvider(provider?.provider_name, provider?.providerDetail);
                return cms.uploadVideo(fullName, fileBuffer, serviceProvider, objectId, objectType);
              } else {
                const failedPromise: Promise<VideoAPIResponse> = new Promise((resolve, _) => {
                  resolve({
                    success: false,
                    statusCode: 400,
                    message: "No Media Provder has been configured"
                  } as VideoAPIResponse)
                })
                return failedPromise;
              }

            });
        });
      if (videoUploadResponse && path != "") {
        console.log(`deleting the file - ${path}`);
        fs.unlinkSync(path);
      } else {
        console.log(`unable to delete video : ${path} . response ${videoUploadResponse?.statusCode}`);
      }
      return res.status(videoUploadResponse?.statusCode || 200).json({ ...videoUploadResponse });
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {}
};

export default withMethods(["POST"], withUserAuthorized(handler));

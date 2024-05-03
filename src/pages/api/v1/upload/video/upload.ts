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
  console.log(String(process.env.MEDIA_UPLOAD_PATH), "media env file uplaod path");
  const destinationPath = path.join(String(process.env.MEDIA_UPLOAD_PATH), fullName);

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
      let needDeletion = false;
      let videoProviderId: string | undefined | null;
      if (objectType == "course") {
        const trailerVideo = await prisma?.course.findUnique({
          where: {
            courseId: objectId,
          },
          select: {
            tvProviderId: true,
          },
        });
        videoProviderId = trailerVideo?.tvProviderId;
        needDeletion = typeof trailerVideo !== undefined || trailerVideo != null;
      } else if (objectType == "lesson") {
        const videoLesson = await prisma?.video.findUnique({
          where: {
            resourceId: objectId,
          },
          select: {
            providerVideoId: true,
          },
        });
        videoProviderId = videoLesson?.providerVideoId;
        needDeletion = typeof videoLesson !== undefined || videoLesson != null;
      }
      const localPath = await saveToDir(fullName, sourcePath);
      const fileBuffer = await fs.promises.readFile(localPath);
      const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
        where: {
          service_type: "media",
        },
      });
      if (serviceProviderResponse) {
        const serviceProvider = cms.getServiceProvider(
          serviceProviderResponse?.provider_name,
          serviceProviderResponse?.providerDetail
        );
        if (needDeletion && videoProviderId) {
          const deletionResponse = await cms.deleteVideo(videoProviderId, objectId, objectType, serviceProvider);
          if (!deletionResponse.success) {
            throw new Error(`Unable to delete the video due to : ${deletionResponse.message}`);
          }
        }
        const uploadResponse = await cms.uploadVideo(fullName, fileBuffer, serviceProvider, objectId, objectType);
        if (localPath != "") {
          console.log(`deleting the file - ${localPath}`);
          fs.unlinkSync(localPath);
        } else {
          console.log(`unable to delete video : ${localPath} . response ${uploadResponse?.statusCode}`);
        }

        return res.status(uploadResponse?.statusCode || 200).json({ ...uploadResponse });
      } else {
        throw new Error("No Media Provder has been configured");
      }
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

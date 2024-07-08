import { NextApiResponse, NextApiRequest } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import path from "path";

import fs from "fs";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { UploadVideoObjectType } from "@/types/courses/Course";
import prisma from "@/lib/prisma";
import { IncomingForm } from "formidable";
export const readFieldWithFile = (req: NextApiRequest) => {
  const form = new IncomingForm({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

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
  if (!process.env.MEDIA_UPLOAD_PATH) {
    throw new Error(" Environment variable MEDIA_UPLOAD_PATH is not set.");
  }
  const isDirExist = fs.existsSync(String(process.env.MEDIA_UPLOAD_PATH));

  if (!isDirExist) {
    throw new Error("Local directory for uploading media does not exist");
  }

  const destinationPath = path.join(String(process.env.MEDIA_UPLOAD_PATH), fullName);

  fs.copyFileSync(sourcePath, destinationPath);

  fs.unlinkSync(sourcePath);
  return destinationPath;
};

async function mergeChunks(
  fileName: string,
  totalChunks: number,

  extention: string,

  filePath: string
) {
  if (!process.env.MEDIA_UPLOAD_PATH) {
    throw new Error(" Environment variable MEDIA_UPLOAD_PATH is not set.");
  }
  const isDirExist = fs.existsSync(String(process.env.MEDIA_UPLOAD_PATH));

  if (!isDirExist) {
    throw new Error("Local directory for uploading media does not exist");
  }

  const outFile = fs.createWriteStream(filePath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = path.join(process.env.MEDIA_UPLOAD_PATH, `${fileName}.part${i}.${extention}`);

    const partStream = fs.createReadStream(chunkFilePath);

    await new Promise<void>((resolve, reject) => {
      partStream.pipe(outFile, { end: false });
      partStream.on("end", () => {
        fs.unlink(chunkFilePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  outFile.end();
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files.file) {
      const name = fields.title[0].replaceAll(" ", "_");
      const objectId = Number(fields.objectId[0]);

      const objectType = fields.objectType[0] as UploadVideoObjectType;
      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      let fullName = ``;

      let needDeletion = false;
      let videoProviderId: string | undefined | null;
      if (objectType == "course") {
        fullName = `${name.replace(/\s+/g, "-")}-${currentTime}.${extension}`;

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
            if (!deletionResponse.success && deletionResponse.statusCode !== 404) {
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
      } else if (objectType == "lesson") {
        const chunkIndex = Number(fields.chunkIndex[0]);
        const totalChunks = Number(fields.totalChunks[0]);
        fullName = `${name}.part${chunkIndex}.${extension}`;
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

        await saveToDir(fullName, sourcePath);
        // lesson videos
        const totalFile = fs.readdirSync(`${process.env.MEDIA_UPLOAD_PATH}`).filter((file) => file.startsWith(name));

        if (totalFile.length === totalChunks) {
          const mergedFinalFilePath = path.join(
            String(process.env.MEDIA_UPLOAD_PATH),
            `${name}.${currentTime}.${extension}`
          );
          await mergeChunks(name, totalChunks, extension, mergedFinalFilePath);

          const fileBuffer = await fs.promises.readFile(mergedFinalFilePath);

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
              if (!deletionResponse.success && deletionResponse.statusCode !== 404) {
                throw new Error(`Unable to delete the video due to : ${deletionResponse.message}`);
              }
            }
            const uploadResponse = await cms.uploadVideo(fullName, fileBuffer, serviceProvider, objectId, objectType);
            if (mergedFinalFilePath != "") {
              console.log(`deleting the file - ${mergedFinalFilePath}`);
              fs.unlinkSync(mergedFinalFilePath);
            } else {
              console.log(`unable to delete video : ${mergedFinalFilePath} . response ${uploadResponse?.statusCode}`);
            }
            return res.status(uploadResponse?.statusCode || 200).json({ ...uploadResponse });
          } else {
            throw new Error("No Media Provder has been configured");
          }
        }

        if (totalFile.length < totalChunks) {
          res.status(200).json({ success: false, message: "uploading" });
        }
      }
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    console.log(error, "er");
    return res.status(400).json({ success: false, message: `${error}` });
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

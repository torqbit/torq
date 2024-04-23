import { NextApiResponse, NextApiRequest } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import path from "path";

import { readFieldWithFile } from "@/pages/api/utils";
import fs from "fs";
import { saveToDir } from "../video/upload";
import { ContentManagementService } from "@/services/cms/ContentManagementService";

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files.file) {
      let path: string = "";
      const name = fields.title[0].replaceAll(" ", "_");
      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      const fullName = `${name.replace(/\s+/g, "-")}-${currentTime}.${extension}`;
      //const path = await saveToDir(fullName, sourcePath);
      const fileUploadResponse = await saveToDir(fullName, sourcePath)
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
              const serviceProvider = cms.getServiceProvider(provider?.provider_name, provider?.providerDetail);
              return cms.uploadFile(fullName, fileBuffer, serviceProvider);
            });
        });

      if (path != "" && fileUploadResponse?.statusCode) {
        console.log(`deleting the file: ${path}`);
        fs.unlinkSync(path);
      } else {
        console.log(path, "path of file");
      }
      return res.status(fileUploadResponse?.statusCode || 200).json({ ...fileUploadResponse });
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    console.log(error);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

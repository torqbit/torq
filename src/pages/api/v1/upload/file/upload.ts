import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import fs from "fs";
import { readFieldWithFile, saveToDir } from "../video/upload";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import prisma from "@/lib/prisma";

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
      const name = fields.title[0].replaceAll(" ", "_");
      const dir = fields.dir[0];

      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      const fullName = `${name.replace(/\s+/g, "-")}-${currentTime}.${extension}`;

      const bannerPath = `${dir}${fullName}`;

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

        const deletionResponse = await cms.deleteFile(`${fields.existingFilePath[0]}`, serviceProvider);
        if (!deletionResponse.success && deletionResponse.statusCode !== 404) {
          throw new Error(`Unable to delete the file due to : ${deletionResponse.message}`);
        }

        const uploadResponse = await cms.uploadFile(fullName, fileBuffer, bannerPath, serviceProvider);
        if (localPath != "") {
          fs.unlinkSync(localPath);
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
    console.log(error);
    return res.status(400).json({ success: false, message: `${error}` });
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

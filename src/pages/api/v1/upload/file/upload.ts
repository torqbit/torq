import { NextApiResponse, NextApiRequest } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import path from "path";

import { readFieldWithFile } from "@/pages/api/utils";
import fs from "fs";
import { saveToDir } from "../video/upload";

export const config = {
  api: {
    bodyParser: false,
  },
};
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
      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      const fullName = `${name.replace(/\s+/g, "-")}-${currentTime}.${extension}`;
      const path = await saveToDir(fullName, sourcePath);

      const service_provider = await prisma?.serviceProvider.findFirst({
        where: {
          provider_name: "bunny img",
        },
      });
      console.log(fields.dir, "dir");
      const dirName = fields.dir;
      const fileData = fs.readFileSync(path);
      console.log(fileData, "file");
      if (fileData && service_provider) {
        const BASE_HOSTNAME = "storage.bunnycdn.com";

        const url = `https://storage.bunnycdn.com/torqbit-files/static/${dirName}/${fullName}`;

        const options = {
          method: "PUT",
          host: BASE_HOSTNAME,
          headers: {
            AccessKey: service_provider?.api_key,
            "Content-Type": "application/json",
          },
          body: fileData,
        };

        fetch(url, options)
          .then((res) => res.json())
          .then((uploadedData) => {
            console.log(uploadedData);
            const deleteLocalFile = fs.unlinkSync(path);
            return res.status(200).json({ success: true, message: "successfully uploaded", fileName: fullName });
          })
          .catch((err: string) => {
            console.error("error:" + err);
          });
      }
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {}
};

export default withMethods(["POST"], withUserAuthorized(handler));

import { NextApiResponse, NextApiRequest } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import path from "path";

import { readFieldWithFile } from "@/pages/api/utils";
import fs from "fs";

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
      const name = fields.title[0].replaceAll(" ", "_");
      const extension = getFileExtension(files.file[0].originalFilename);
      const sourcePath = files.file[0].filepath;
      const currentTime = new Date().getTime();
      const fullName = `${name.replace(/\s+/g, "-")}-${currentTime}.${extension}`;
      const path = await saveToDir(fullName, sourcePath);

      const service_provider = await prisma?.serviceProvider.findFirst({
        where: {
          provider_name: "bunny",
        },
      });
      const fileData = fs.readFileSync(path);

      if (service_provider) {
        const url = `https://video.bunnycdn.com/library/${service_provider.api_secret}/videos`;
        const options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            AccessKey: service_provider.api_key as string,
          },
          body: JSON.stringify({ title: fullName }),
        };

        fetch(url, options)
          .then((res) => res.json())
          .then(async (json: any) => {
            console.log(fileData, "this is json");

            const url2 = `https://video.bunnycdn.com/library/${service_provider.api_secret}/videos/${json.guid}`;
            const options = {
              method: "PUT",
              headers: { accept: "application/json", AccessKey: service_provider.api_key },
              body: fileData,
            };

            fetch(url2, options)
              .then((res) => res.json())
              .then(async (uploadData: any) => {
                console.log(uploadData, "upload");

                const url3 = `https://video.bunnycdn.com/library/${service_provider?.api_secret}/videos/${json.guid}`;
                const options = {
                  method: "GET",
                  headers: {
                    accept: "application/json",
                    AccessKey: service_provider?.api_key as string,
                  },
                };

                fetch(url3, options)
                  .then((res: { json: () => any }) => res.json())
                  .then(async (videoData: any) => {
                    const deleteLocalFile = fs.unlinkSync(path);
                    console.log(videoData, "vido");
                    return res
                      .status(200)
                      .json({ success: true, message: "uploaded successfully", videoData: videoData });
                  })
                  .catch((err: string) => console.error("error:" + err));
              })
              .catch((err: string) => {
                console.error("error:" + err, "this is error");
              });
          })
          .catch((err: string) => {
            console.error("error:" + err, "last");
          });
      }
    }

    if (!files) {
      return res.status(400).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    console.log(error, "my error");
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

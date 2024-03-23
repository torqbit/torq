import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { createVideo } from "./method";
import { readFieldWithFile } from "@/pages/api/utils";
import fetch from "node-fetch";

import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define an async function to convert buffer data to binary
async function bufferToBinary(bufferData: Buffer) {
  try {
    // Convert the buffer data to a binary string
    const binaryString = bufferData.toString("binary");
    return binaryString;
  } catch (error) {
    console.error("Error converting buffer to binary:", error);
    throw error;
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    console.log(fields, "f");
    const service_provider = await prisma?.serviceProvider.findFirst({
      where: {
        provider_name: "bunny",
      },
    });
    if (service_provider) {
      const url1 = `https://video.bunnycdn.com/library/${Number(service_provider.api_secret)}/videos`;
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          AccessKey: service_provider.api_key as string,
        },
        body: JSON.stringify({ title: fields.title[0] }),
      };

      fetch(url1, options)
        .then((res) => res.json())
        .then(async (jsonRes: any) => {
          console.log("hit 2", jsonRes);

          const fileData = fs.readFileSync(files.files[0].filepath as string);
          const base64Data = await bufferToBinary(fileData);
          // console.log(base64Data, "file");

          const url2 = `https://video.bunnycdn.com/library/${service_provider.api_key}/videos/${jsonRes.guid}`;
          const options = {
            method: "PUT",
            headers: { accept: "application/json", AccessKey: service_provider.api_key },
            body: base64Data,
          };

          fetch(url2, options)
            .then((res) => res.json())
            .then(async (json: any) => {
              const url3 = `https://video.bunnycdn.com/library/${service_provider.api_secret}/videos/${jsonRes.guid}`;
              const options = {
                method: "GET",
                headers: {
                  accept: "application/json",
                  AccessKey: service_provider.api_key as string,
                },
              };

              fetch(url3, options)
                .then((res: { json: () => any }) => res.json())
                .then(async (videoRes: any) => {
                  return res.status(200).json({ success: true, message: "uploaded successfully", videoData: videoRes });
                })
                .catch((err: string) => console.error("error:" + err));
            })
            .catch((err: string) => {
              console.error("error:" + err);
            });
        })
        .catch((err: string) => {
          console.error("error:" + err);
        });

      // console.log(create, "create data");
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

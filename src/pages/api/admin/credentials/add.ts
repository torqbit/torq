import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { encrypt } from "./encryption";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { service_type, provider_name, api_key, api_secret } = body;
    console.log(body, "body");
    if (body) {
      const encrypted_api_key = encrypt(api_key);
      const encrypted_api_secret = encrypt(api_secret);

      const addCredentials = await prisma?.serviceProvider.create({
        data: {
          service_type: service_type,
          provider_name: provider_name,
          api_key: encrypted_api_key,
          api_secret: encrypted_api_secret,
        },
      });

      return res.status(200).json({ success: true, message: "credentials added successfully " });
    } else {
      return res.status(204).json({ success: false, message: "field is empty " });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default handler;

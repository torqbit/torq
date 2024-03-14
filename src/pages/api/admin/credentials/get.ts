import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { decrypt } from "./encryption";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const credentials = await prisma.serviceProvider.findFirst({
      where: {
        id: 1,
      },
    });
    console.log(credentials);
    if (credentials) {
      const decrypted_api_key = decrypt(credentials.api_key);
      console.log(decrypted_api_key, "api");
      return res.status(200).json({ success: true, messsage: "Found credentials", credentials });
    }
  } catch (err) {
    console.log(err);
    return errorHandler(err, res);
  }
};

export default handler;

// not woriking

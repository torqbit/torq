import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { decrypt } from "../../encryption";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { name } = query;
    if (name) {
      const credentials = await prisma.configProvider.findFirst({
        where: {
          name: name as string,
        },
      });
      if (credentials) {
        // const decrypted_api_key = decrypt(credentials.api_key);

        return res.status(200).json({ success: true, messsage: "Found credentials", credentials });
      }
    }
  } catch (err) {
    console.log(err);
    return errorHandler(err, res);
  }
};
export default withMethods(["GET"], withUserAuthorized(handler));

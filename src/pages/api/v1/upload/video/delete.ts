import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { videoId } = body;

    const service_provider = await prisma.serviceProvider.findFirst({
      where: {
        provider_name: "bunny",
      },
    });
    if (service_provider) {
      const options = {
        method: "DELETE",
        headers: {
          accept: "application/json",
          AccessKey: service_provider.api_key,
        },
      };

      fetch(`https://video.bunnycdn.com/library/${service_provider.api_secret}/videos/${videoId}`, options)
        .then((response: { json: () => any }) => response.json())
        .then((response: any) => {
          return res.status(200).json({ success: true, message: "successfully deleted" });
        })
        .catch((err: any) => console.error(err));
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

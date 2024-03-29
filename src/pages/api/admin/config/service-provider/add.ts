import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, serviceType, providerDetail } = body;
    console.log(body, "provide");

    if (body) {
      const isConfigExist = await prisma.serviceProvider.findUnique({
        where: {
          service_type: serviceType,
        },
      });

      if (isConfigExist) {
        const add = await prisma.serviceProvider.update({
          where: {
            service_type: serviceType as string,
          },
          data: {
            provider_name: name,
            service_type: serviceType,
            providerDetail: [providerDetail],
          },
        });
        return res.status(200).json({ success: true, message: "credentials updated successfully" });
      } else if (!isConfigExist) {
        const add = await prisma.serviceProvider.create({
          data: {
            provider_name: name,
            service_type: serviceType,
            providerDetail: providerDetail,
          },
        });

        return res.status(200).json({ success: true, message: "credentials added successfully " });
      }
    } else {
      return res.status(204).json({ success: false, message: "field is empty " });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

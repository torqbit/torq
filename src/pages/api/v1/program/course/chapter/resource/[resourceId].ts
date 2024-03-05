import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { resourceId } = req.query;
    const resource = await prisma.resource.findUnique({
      where: {
        resourceId: Number(resourceId),
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "Resource found",
      resource: resource,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

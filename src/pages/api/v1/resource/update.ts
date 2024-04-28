import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, description, resourceId } = body;
    let updateObj: any = {};

    if (name) updateObj["name"] = name;
    if (description) updateObj["description"] = description;

    const updatedResource = await prisma.resource.update({
      where: {
        resourceId: resourceId,
      },
      data: {
        ...updateObj,
      },
    });

    return res.status(200).json({
      info: false,
      success: true,
      message: "Lesson updated successfully",
      resource: updatedResource,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

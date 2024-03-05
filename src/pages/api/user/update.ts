import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { userId, name, role, isActive, phone } = body;

    const updateObj: any = {};
    if (name) updateObj.name = name;
    if (phone) updateObj.phone = phone;
    if (role) updateObj.role = role;
    updateObj.isActive = isActive;

    const newResource = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateObj,
    });

    return res.status(200).json({ created: newResource, success: true, message: "User Profile updated successfully" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

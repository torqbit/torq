import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const body = await req.body;
    const { name, role, isActive, phone, image, userId } = body;

    const updateObj: any = {};
    if (name) updateObj.name = name;
    if (phone) updateObj.phone = String(phone);
    if (role) updateObj.role = role;
    if (image) updateObj.image = image;

    updateObj.isActive = isActive;

    const newResource = await prisma.user.update({
      where: {
        id: userId ? userId : token?.id,
      },
      data: updateObj,
    });

    return res.status(200).json({ created: newResource, success: true, message: "User Profile updated successfully" });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

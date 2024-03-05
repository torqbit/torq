import appConstant from "@/services/appConstant";
import { Prisma } from "@prisma/client";
import type { NextApiResponse } from "next";

export function errorHandler(err: unknown, res: NextApiResponse) {
  if (
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    return res.status(422).json({ success: false, error: err.message });
  } else if (typeof err === "string") {
    return res.status(500).json({ success: false, error: err });
  } else {
    return res.status(500).json({ success: false, error: appConstant.cmnErrorMsg });
  }
}

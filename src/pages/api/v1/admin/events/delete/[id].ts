import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    await prisma.events.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({ success: true, message: "Evnet has been deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withAuthentication(withUserAuthorized(handler)));

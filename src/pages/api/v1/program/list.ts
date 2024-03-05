import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { state } = req.query as any;
    const allProgram = await prisma.program.findMany({
      orderBy: [{ id: "asc" }],
      where: {
        state: state,
      },
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "Program Loaded",
      programs: allProgram,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

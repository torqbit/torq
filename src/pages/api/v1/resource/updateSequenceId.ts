import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = req.body;

    data.map(async (seq: { resourceId: number; updatedSeq: number }) => {
      await prisma.resource.update({
        where: {
          resourceId: seq.resourceId,
        },
        data: {
          sequenceId: seq.updatedSeq,
        },
      });
    });

    return res.status(200).json({ success: true, message: "Sequence has been updated" });
  } catch (error) {
    errorHandler(error, res);
  }
};
export default withMethods(["POST"], withAuthentication(handler));

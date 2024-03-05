import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { imagekit } from "../../../utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fileId } = req.query;
    const deletedFile = await imagekit.deleteFile(fileId as string);
    return res.status(200).json({ success: true, messsage: "File deleted successfully", deletedFile });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

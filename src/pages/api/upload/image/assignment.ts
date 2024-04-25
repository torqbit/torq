import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { imagekit, uploadFileToImgKit } from "../../v1/discussions/add/[id]";
import { readFile } from "../../program/upload";
import appConstant from "@/services/appConstant";

// Important for NextJS!
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // read file from request
    const { url, files } = (await readFile(req)) as any;
    if (files) {
      const imgRes = await uploadFileToImgKit(files.file, appConstant.assignmentFileFolder);
      return res.status(200).json({
        success: true,
        data: {
          success: 1,
          file: {
            url: imgRes.url,
          },
        },
      });
    }

    res.status(404);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

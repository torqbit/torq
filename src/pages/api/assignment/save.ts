import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { readFieldWithFile } from "../utils";

const path = require("path");
const fs = require("fs");
// Important for NextJS!
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // read file from request
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files?.file) {
      if (files?.file?.length > 1) {
        return res.status(400).json({
          success: false,
          message: "You can't upload multiple files",
        });
      } else {
        const sourcePath = files.file[0].filepath;
        const destinationPath = path.join("public/assignment", files.file[0].originalFilename);
        // Copy the file
        fs.copyFileSync(sourcePath, destinationPath);
        // Optionally, you can remove the original file
        fs.unlinkSync(sourcePath);
        return res.status(200).json({
          success: true,
          path: destinationPath,
          fileName: files.file[0].originalFilename,
        });
      }
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

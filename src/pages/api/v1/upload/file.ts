import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { readFieldWithFile, uploadFileToImgKit } from "../../utils";
import formidable from "formidable";

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
    const uploadedFile: Array<{ url: string; fileId: string }> = [];
    if (files?.files) {
      if (files?.files?.length) {
        const allPromise = files.files.map((file: formidable.File) => {
          return new Promise(async (resolve, reject) => {
            const res = await uploadFileToImgKit(file, fields.folder);
            uploadedFile.push({ url: res.url, fileId: res.fileId });
            resolve({});
          });
        });
        await Promise.all(allPromise);
      } else {
        const res = await uploadFileToImgKit(files.files, fields.folder);
        uploadedFile.push({ url: res.url, fileId: res.fileId });
      }
    }
    return res.status(200).json({
      success: true,
      uploadedFile: uploadedFile,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

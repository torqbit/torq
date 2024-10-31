import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import fs from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

    const query = req.query;
    const { courseId, assignmentId, fileName } = query;

    let filePath = fileName as string[];
    if (filePath && filePath.length > 0) {
      let uploadFilePath = `${process.env.ASSIGNMENT_UPLOAD_PATH}/${
        token?.id
      }/course-${courseId}/lesson-${assignmentId}/files/${filePath.length > 1 ? filePath.join("/") : filePath[0]}`;

      const file = fs.readFileSync(uploadFilePath);

      if (uploadFilePath.endsWith(".html")) {
        res.setHeader("Content-Type", "text/html");
        res.status(200).send(file);
      }

      if (uploadFilePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", new Date().toUTCString());
        res.status(200).send(file);
      }
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import appConstant from "@/services/appConstant";
const path = require("path");
const fs = require("fs");

export let cookieName = appConstant.development.cookieName;
if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
  cookieName = appConstant.production.cookieName;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    const courseId = req.query?.programId;
    const resourceId = req.query?.resourceId;

    const resourceDetail = await prisma.resource.findFirst({
      where: {
        resourceId: Number(resourceId),
      },
    });

    const getRegistraionInfo = await prisma.courseRegistration.findFirst({
      where: {
        courseId: Number(courseId),
        studentId: token?.id,
      },
    });

    if (getRegistraionInfo || token?.role === "AUTHOR") {
      if (resourceDetail?.contentType === "Assignment" && resourceDetail) {
        let filePath = path.join(process.env.PDF_DIRECTORY, `/${resourceDetail}`);

        fs.readFile(filePath, { encoding: "utf-8" }, function (err: any, data: string) {
          if (!err) {
            let file = fs.createReadStream(filePath);
            let stat = fs.statSync(filePath);

            res.setHeader("Content-Length", stat.size);
            res.setHeader("Content-Type", "application/pdf");
            // res.setHeader("Content-Disposition", `attachment; filename=${resourceDetail.content}`);  // to download
            file.pipe(res);
          } else {
            return res.json({ status: true, message: "Resource is locked" });
          }
        });
      }
    } else {
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

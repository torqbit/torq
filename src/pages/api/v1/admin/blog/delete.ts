import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { ContentManagementService } from "@/services/cms/ContentManagementService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();
    const cms = new ContentManagementService();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const { blogId, filePath } = req.query;

    const isBlogExist = await prisma.blog.findUnique({
      where: {
        id: String(blogId),
      },
      select: {
        banner: true,
      },
    });

    if (isBlogExist) {
      await prisma.blog.delete({
        where: {
          id: String(blogId),
          authorId: String(token?.id),
        },
      });

      //   const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
      //     where: {
      //       service_type: "media",
      //     },
      //   });
      //   if (serviceProviderResponse) {
      //     const serviceProvider = cms.getServiceProvider(
      //       serviceProviderResponse?.provider_name,
      //       serviceProviderResponse?.providerDetail
      //     );
      //     if (isBlogExist) {
      //       const deletionResponse = await cms.deleteFile(`${isBlogExist.banner}`, serviceProvider);
      //       if (!deletionResponse.success && deletionResponse.statusCode !== 404) {
      //         throw new Error(`Unable to delete the file due to : ${deletionResponse.message}`);
      //       }
      //     }
      //   }
      return res.status(200).json({ success: true, message: "Blog has been deleted" });
    } else {
      return res.status(400).json({ success: false, error: "Blog not exist" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["DELETE"], withUserAuthorized(handler));

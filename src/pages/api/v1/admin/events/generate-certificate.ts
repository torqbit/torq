import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCertificateDescripiton1, getCertificateDescripiton2, getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { generateCertificate, getDateAndYear } from "@/lib/addCertificate";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import fs from "fs";
import appConstant from "@/services/appConstant";
import path from "path";
import MailerService from "@/services/MailerService";
import { IEventEmailConfig } from "@/lib/emailConfig";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const { eventId = 2, name, registrationId, email } = req.body;

    const eventInfo = await prisma.events.findUnique({
      where: {
        id: eventId,
      },
      select: {
        certificateTemplate: true,
        title: true,
        startTime: true,
        authorId: true,
        slug: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const sendMail = (certificatePdfPath: string) => {
      const configData: IEventEmailConfig = {
        name: name,
        email: email,
        eventName: String(eventInfo?.title),
        pdfPath: String(certificatePdfPath),
        slug: String(eventInfo?.slug),
      };

      MailerService.sendMail("EVENT_COMPLETION", configData).then((result) => {
        console.log(result.error);
      });
      return res.status(200).json({ success: true, message: `Email has been successfully sent to ${name}` });
    };

    const findRegistrationDetail = await prisma.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId: eventId,
          email: email,
        },
      },
      select: {
        certificatePdfPath: true,
      },
    });

    if (findRegistrationDetail?.certificatePdfPath) {
      sendMail(findRegistrationDetail.certificatePdfPath);
    }

    if (eventInfo?.authorId === token?.id) {
      const onReject = (error: string) => {
        return res.status(400).json({ success: false, error });
      };
      const onComplete = async (pdfTempPath: string, imgPath: string) => {
        const cms = new ContentManagementService();
        const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
          where: {
            service_type: "media",
          },
        });
        if (serviceProviderResponse && pdfTempPath && imgPath) {
          const serviceProvider = cms.getServiceProvider(
            serviceProviderResponse?.provider_name,
            serviceProviderResponse?.providerDetail
          );
          const pdfBuffer = fs.readFileSync(pdfTempPath);

          const imgBuffer = fs.readFileSync(imgPath as string);
          let imgName = `${registrationId}.png`;
          let pdfName = `${registrationId}.pdf`;

          const fileImgPath = path.join(appConstant.certificateDirectory, imgName);
          const pdfPath = path.join(appConstant.certificateDirectory, pdfName);
          const fileArray = [
            {
              fileBuffer: imgBuffer,
              fullName: imgName,
              filePath: fileImgPath,
              name: "img",
            },
            {
              fileBuffer: pdfBuffer,
              fullName: pdfName,
              filePath: pdfPath,
              name: "pdf",
            },
          ];

          fileArray.forEach(async (file) => {
            const response = await cms.uploadFile(
              file.fullName,
              file.fileBuffer,
              file.filePath,

              serviceProvider
            );

            let data =
              file.name === "img"
                ? {
                    certificate: response.fileCDNPath,
                  }
                : {
                    certificatePdfPath: response.fileCDNPath,
                  };

            await prisma.eventRegistration
              .update({
                where: {
                  eventId_email: {
                    eventId: eventId,
                    email: email,
                  },
                },
                data,
              })
              .then((r) => {
                if (r?.certificatePdfPath) {
                  sendMail(r.certificatePdfPath);
                }
              });
          });

          if (pdfTempPath && imgPath) {
            fs.unlinkSync(imgPath);
            fs.unlinkSync(pdfTempPath);
          }
        } else {
          throw new Error("No Media Provder has been configured");
        }
      };

      let description1 = getCertificateDescripiton1("EVENT", String(eventInfo?.title));
      let description2 = getCertificateDescripiton2("EVENT", String(eventInfo?.user.name));

      generateCertificate(
        String(eventInfo?.certificateTemplate),
        description1,
        description2,
        name,
        eventInfo?.user.name as string,
        getDateAndYear(eventInfo?.startTime as Date),
        String(eventInfo?.certificateTemplate),
        onComplete,
        onReject
      ).then(async (r) => {
        const updatedRegistrationDetail = await prisma.eventRegistration.findUnique({
          where: {
            eventId_email: {
              eventId: eventId,
              email: email,
            },
          },
          select: {
            certificatePdfPath: true,
          },
        });
      });
    } else {
      return res.status(403).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));

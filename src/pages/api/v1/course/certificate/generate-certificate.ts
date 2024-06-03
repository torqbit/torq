import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import fs from "fs";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import appConstant from "@/services/appConstant";
import path from "path";
import { generateCertificate } from "@/lib/addCertificate";
import { MailerService, getEventEmail } from "@/services/ems/EmailManagementService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cms = new ContentManagementService();

    let cookieName = getCookieName();

    const { courseId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = token?.id;

    const course = await prisma.course.findUnique({
      where: {
        courseId: Number(courseId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        chapters: {
          where: {
            courseId: Number(courseId),
          },
          include: {
            resource: {
              where: {
                state: "ACTIVE",
              },
              include: {
                video: {},
              },
            },
          },
        },
      },
    });

    const findExistingCertificate = await prisma.courseCertificates.findFirst({
      where: {
        studentId: String(token?.id),
        courseId: Number(courseId),
      },
    });

    const findProgress = await prisma.courseProgress.count({
      where: {
        studentId: authorId,
        courseId: Number(courseId),
      },
    });

    if (findProgress === course?.totalResources) {
      if (findExistingCertificate && findExistingCertificate.imagePath && findExistingCertificate.pdfPath) {
        return res.status(200).json({
          info: false,
          success: true,
          message: "course successfully fetched",
          certificateIssueId: findExistingCertificate.id,
        });
      } else if (!findExistingCertificate) {
        const createCertificate = await prisma.courseCertificates.create({
          data: {
            courseId: Number(courseId),
            studentId: String(token?.id),
          },
        });
        const onComplete = async (pdfTempPath: string, imgPath: string) => {
          const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
            where: {
              service_type: "media",
            },
          });
          if (serviceProviderResponse && pdfTempPath && imgPath) {
            let certificateIssueId;
            const serviceProvider = cms.getServiceProvider(
              serviceProviderResponse?.provider_name,
              serviceProviderResponse?.providerDetail
            );
            const pdfBuffer = fs.readFileSync(pdfTempPath);

            const imgBuffer = fs.readFileSync(imgPath as string);
            let imgName = `${createCertificate.id}.png`;
            let pdfName = `${createCertificate.id}.pdf`;

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
                      imagePath: response.fileCDNPath,
                    }
                  : {
                      pdfPath: response.fileCDNPath,
                    };

              const certificateData = await prisma.courseCertificates.update({
                where: {
                  id: createCertificate.id,
                },

                data,
              });
              certificateIssueId = certificateData.id;
            });
            if (pdfTempPath && imgPath) {
              fs.unlinkSync(imgPath);
              fs.unlinkSync(pdfTempPath);
            }
            const courseRegistrationData = await prisma.courseRegistration.findFirst({
              where: {
                courseId: course?.courseId,
                studentId: token?.id,
              },
            });
            await prisma.courseRegistration.update({
              where: {
                registrationId: courseRegistrationData?.registrationId,
              },
              data: {
                courseState: "COMPLETED",
              },
            });

            const configData = getEventEmail("COURSE_COMPLETION");

            new MailerService().sendMail(
              "COURSE_COMPLETION",
              configData,
              String(token?.email),
              String(token?.name),
              String(token?.id),

              Number(courseId)
            );

            return res.status(200).json({
              success: true,
              certificateIssueId: createCertificate.id,
            });
          } else {
            throw new Error("No Media Provder has been configured");
          }
        };

        let description = `who has successfully completed the course ${course?.name}, an online course   authored by ${course?.user.name} and offered by Torqbit`;

        generateCertificate(
          createCertificate.id,
          description,
          token?.name as string,
          course?.user.name as string,
          String(course?.certificateTemplate),
          onComplete
        );
      }
    } else {
      return res.status(400).json({ success: false, error: "first complete the course !" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { date } from "zod";
import moment from "moment";
import { certificateConfig } from "@/lib/certificatesConfig";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import path, { join } from "path";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
export const addNameAndCourse = async (
  descripiton: string,
  studentName: string,
  authorName: string,
  certificateIssueId: string,
  certificateId?: string
) => {
  return new Promise(async (resolve: (value: string) => void, reject) => {
    if (certificateId && certificateIssueId) {
      const certificateData = certificateConfig.find((c) => c.id === certificateId);
      const filePath = path.join(process.cwd(), "/public/certificates/templates/golden-luxury.png");
      const italicPath = path.join(process.cwd(), "/public/DM_Serif_Display/DMSerifDisplay-Italic.ttf");
      const regularPath = path.join(process.cwd(), "/public/DM_Serif_Display/DMSerifDisplay-Regular.ttf");
      const kalamPath = path.join(process.cwd(), "/public/DM_Serif_Display/Kalam-Regular.ttf");

      const kaushanPath = path.join(process.cwd(), "/public/DM_Serif_Display/KaushanScript-Regular.ttf");
      registerFont(kalamPath, { family: "Kalam" });
      registerFont(kaushanPath, { family: "Kaushan Script" });
      const canvas = createCanvas(2000, 1414);
      const ctx = canvas.getContext("2d");
      loadImage(filePath).then((image) => {
        ctx.drawImage(image, 0, 0);
        ctx.font = '40px "Kaushan Script"';
        ctx.fillStyle = certificateData?.color.description as string;
        ctx.textAlign = "center";
        ctx.fillText(
          descripiton,
          Number(certificateData?.coordinates.description.x),
          Number(certificateData?.coordinates.description.y)
        );
        ctx.font = '50px "Kaushan Script"';
        ctx.fillStyle = certificateData?.color.student as string;
        ctx.textAlign = "center";
        ctx.fillText(
          studentName,
          Number(certificateData?.coordinates.student.x),
          Number(certificateData?.coordinates.student.y)
        );
        ctx.font = '40px "Kalam"';
        ctx.fillStyle = certificateData?.color.authorSignature as string;
        ctx.textAlign = "center";
        ctx.fillText(
          authorName,
          Number(certificateData?.coordinates.authorSignature.x),
          Number(certificateData?.coordinates.authorSignature.y)
        );
        ctx.font = '40px "Kaushan Script"';
        ctx.fillStyle = certificateData?.color.date as string;
        ctx.textAlign = "center";
        ctx.fillText(
          moment(new Date()).format("MMM-DD-YY  hh:mm a"),
          Number(certificateData?.coordinates.dateOfCompletion.x),
          Number(certificateData?.coordinates.dateOfCompletion.y)
        );
        const buffer = canvas.toBuffer("image/png");
        console.log(buffer, "b");
        const outputPath = path.join(process.cwd(), `/public/resource/${certificateIssueId}.png`);
        fs.writeFileSync(outputPath, buffer);
        // Convert the canvas to a data URL
        let dataURL = canvas.toDataURL("image/png");
        // Execute the callback with the data URL
        // resolve(dataURL.split(",")[1]);
        resolve(outputPath);
        image.onerror = function (err) {
          console.log("add label err", err);
          reject(new Error("Error loading image."));
        };
      });
    }
    // save to local
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cms = new ContentManagementService();

    let cookieName = getCookieName();

    const { courseId, certificateId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });
    console.log(req.query, "q");
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

    const findProgress = await prisma.courseProgress.findMany({
      orderBy: [{ createdAt: "asc" }],

      where: {
        studentId: authorId,
        courseId: Number(courseId),
      },
    });

    if (findProgress.length > 0) {
      if (findExistingCertificate && findExistingCertificate.imagePath) {
        return res.status(200).json({
          info: false,
          success: true,
          message: "course successfully fetched",
          latestProgress: {
            nextChap: course?.chapters[0],
            nextLesson: course?.chapters[0].resource[0],
            completed: true,
            certificateIssueId: findExistingCertificate.id,
          },
          courseDetails: course,
        });
      } else if (!findExistingCertificate) {
        let lastIndex = findProgress.length > 0 ? findProgress.length - 1 : 0;

        const currentResource = await prisma.resource.findUnique({
          where: {
            resourceId: findProgress[lastIndex]?.resourceId,
          },
        });

        const currChapter = await prisma.chapter.findUnique({
          where: {
            chapterId: findProgress[lastIndex]?.chapterId,
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
        });
        let nextLesson;
        let nextChap;
        let completed;
        let certificateIssueId;
        if (currentResource && currChapter && currChapter?.resource.length > currentResource?.sequenceId) {
          nextChap = currChapter;
          nextLesson = currChapter.resource.find((r) => r.sequenceId === currentResource.sequenceId + 1);
          completed = false;
        }
        if (currentResource && currChapter && currChapter?.resource.length === currentResource?.sequenceId) {
          nextChap = course?.chapters.find((chapter) => chapter.sequenceId === currChapter.sequenceId + 1);
          nextLesson = nextChap?.resource[0];
          completed = false;
        }

        if (
          course?.chapters.length === currChapter?.sequenceId &&
          currChapter?.resource.length === currentResource?.sequenceId
        ) {
          completed = true;
          if (!findExistingCertificate && certificateId) {
            const createCertificate = await prisma.courseCertificates.create({
              data: {
                courseId: Number(courseId),
                studentId: String(token?.id),
              },
            });

            certificateIssueId = createCertificate.id;
            let description = `who has successfully completed the course ${course?.name}, an online course  authored by ${course?.user.name} and offered by Torqbit`;

            const updatedImg =
              token?.name &&
              (await addNameAndCourse(
                description,
                token?.name,
                course?.user.name as string,
                certificateIssueId,
                String(certificateId)
              ));

            const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
              where: {
                service_type: "media",
              },
            });
            if (serviceProviderResponse) {
              const serviceProvider = cms.getServiceProvider(
                serviceProviderResponse?.provider_name,
                serviceProviderResponse?.providerDetail
              );

              const fileBuffer = fs.readFileSync(updatedImg as string);
              let fullName = `${certificateIssueId}.png`;
              let dir = "/courses/certificates/";
              const bannerPath = `${dir}${fullName}`;
              const uploadResponse = await cms.uploadFile(fullName, fileBuffer, bannerPath, serviceProvider);
              if (updatedImg) {
                fs.unlinkSync(updatedImg);
              }

              const updateCourseCertificate = await prisma.courseCertificates.updateMany({
                where: {
                  studentId: token?.id,
                  courseId: Number(courseId),
                },
                data: {
                  imagePath: uploadResponse.fileCDNPath,
                },
              });

              nextChap = course?.chapters[0];
              nextLesson = nextChap?.resource[0];
              completed = true;

              return res.status(uploadResponse?.statusCode || 200).json({
                courseDetails: course,
                latestProgress: {
                  nextChap: nextChap,
                  nextLesson: nextLesson,
                  completed: true,
                  certificateIssueId: certificateIssueId,
                },
              });
            } else {
              throw new Error("No Media Provder has been configured");
            }
          } else {
            let progressData = {
              nextChap: nextChap,
              nextLesson: nextLesson,
              completed: true,
            };

            return res.status(200).json({
              info: false,
              success: true,
              message: "course successfully fetched",
              courseDetails: course,

              latestProgress: progressData,
            });
          }
        }

        return res.status(200).json({
          courseDetails: course,
          latestProgress: {
            nextChap: nextChap,
            nextLesson: nextLesson,
            completed: true,
            certificateIssueId: certificateIssueId,
          },
        });
      }
    } else {
      return res.status(200).json({
        info: false,
        success: true,
        message: "course successfully fetched ",
        latestProgress: {
          nextChap: course?.chapters[0],
          nextLesson: course?.chapters[0].resource[0],
        },
        courseDetails: course,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

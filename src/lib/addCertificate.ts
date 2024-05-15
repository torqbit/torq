import { date } from "zod";
import moment from "moment";
import { certificateConfig } from "@/lib/certificatesConfig";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import path, { join } from "path";

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

      const filePath = path.join(process.cwd(), `/public/${certificateData?.path}`);
      const italicPath = path.join(process.cwd(), "/public/DM_Serif_Display/DMSerifDisplay-Italic.ttf");
      const regularPath = path.join(process.cwd(), "/public/DM_Serif_Display/DMSerifDisplay-Regular.ttf");
      const kalamPath = path.join(process.cwd(), "/public/DM_Serif_Display/Kalam-Regular.ttf");
      const kaushanPath = path.join(process.cwd(), "/public/DM_Serif_Display/KaushanScript-Regular.ttf");

      registerFont(kalamPath, { family: "Kalam" });
      registerFont(kaushanPath, { family: "Kaushan Script" });

      const canvas = createCanvas(2000, 1414);
      const ctx = canvas.getContext("2d");

      certificateData?.color &&
        loadImage(filePath).then((image) => {
          ctx.drawImage(image, 0, 0);
          ctx.font = '40px "Kaushan Script"';
          ctx.fillStyle = certificateData.color.description as string;
          ctx.textAlign = "center";
          ctx.fillText(
            descripiton,
            Number(certificateData?.coordinates.description.x),
            Number(certificateData?.coordinates.description.y),
            1200
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

          if (!process.env.MEDIA_UPLOAD_PATH) {
            throw new Error(" Environment variable MEDIA_UPLOAD_PATH is not set.");
          }
          const isDirExist = fs.existsSync(String(process.env.MEDIA_UPLOAD_PATH));

          if (!isDirExist) {
            throw new Error("Local directory for uploading media does not exist");
          }

          const outputPath = path.join(process.env.MEDIA_UPLOAD_PATH, `${certificateIssueId}.png`);
          fs.writeFileSync(outputPath, buffer);

          //   let dataURL = canvas.toDataURL("image/png");

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

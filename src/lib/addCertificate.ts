import { date } from "zod";
import moment from "moment";
import { certificateConfig } from "@/lib/certificatesConfig";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
const PDFDocument = require("pdfkit");

import path, { join } from "path";
import { ContentManagementService } from "@/services/cms/ContentManagementService";

export const getDateAndYear = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNumber = currentDate.getMonth();
  const day = currentDate.getDate();
  const date = new Date(year, monthNumber, day); // 2009-11-10
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} ${day}, ${year}`;
};

export const onCreateImg = async (
  descripiton: string,
  studentName: string,
  authorName: string,
  certificateIssueId: string,
  certificateId?: string
) => {
  const certificateData = certificateConfig.find((c) => c.id === certificateId);

  const filePath = path.join(process.cwd(), `/public/${certificateData?.path}`);
  const italicPath = path.join(process.cwd(), "/public/fonts/DM_Serif_Display/DMSerifDisplay-Italic.ttf");
  const regularPath = path.join(process.cwd(), "/public/fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf");
  const kalamPath = path.join(process.cwd(), "/public/fonts/Kalam-Regular.ttf");
  const kaushanPath = path.join(process.cwd(), "/public/fonts/KaushanScript-Regular.ttf");
  const outputPath = path.join(`${process.env.MEDIA_UPLOAD_PATH}`, `${certificateIssueId}.png`);

  registerFont(kalamPath, { family: "Kalam" });
  registerFont(kaushanPath, { family: "Kaushan Script" });

  const canvas = createCanvas(2000, 1414);
  const ctx = canvas.getContext("2d");

  const uploadedPath =
    certificateData?.color &&
    (await loadImage(filePath).then((image) => {
      ctx.drawImage(image, 0, 0);
      ctx.font = '40px "Kaushan Script"';
      ctx.fillStyle = certificateData.color.description as string;
      ctx.textAlign = "center";
      ctx.fillText(
        descripiton,
        certificateData?.coordinates.description.x,
        certificateData?.coordinates.description.y,
        1200
      );
      ctx.font = '50px "Kaushan Script"';
      ctx.fillStyle = certificateData?.color.student as string;
      ctx.textAlign = "center";
      ctx.fillText(studentName, certificateData?.coordinates.student.x, certificateData?.coordinates.student.y);
      ctx.font = '40px "Kalam"';
      ctx.fillStyle = certificateData?.color.authorSignature as string;
      ctx.textAlign = "center";
      ctx.fillText(
        authorName,
        certificateData?.coordinates.authorSignature.x,
        certificateData?.coordinates.authorSignature.y
      );
      ctx.font = '40px "Kaushan Script"';
      ctx.fillStyle = certificateData?.color.date as string;
      ctx.textAlign = "center";
      ctx.fillText(
        getDateAndYear(),
        certificateData?.coordinates.dateOfCompletion.x,
        certificateData?.coordinates.dateOfCompletion.y
      );
      const buffer = canvas.toBuffer("image/png");

      if (!process.env.MEDIA_UPLOAD_PATH) {
        throw new Error(" Environment variable MEDIA_UPLOAD_PATH is not set.");
      }
      const isDirExist = fs.existsSync(String(process.env.MEDIA_UPLOAD_PATH));

      if (!isDirExist) {
        throw new Error("Local directory for uploading media does not exist");
      }

      fs.writeFileSync(outputPath, buffer);

      //   let dataURL = canvas.toDataURL("image/png");

      image.onerror = function (err) {
        console.log("add label err", err);
      };
      return outputPath;
    }));

  return uploadedPath;

  // save to local
};

export const generatingCertificate = async (
  certificateIssueId: string,
  descripiton: string,
  studentName: string,
  authorName: string,
  certificateId: string,
  onComplete: (pdfTempPath: string, imgPath: string, certificateIssueId: string, cms: ContentManagementService) => void,
  cms: ContentManagementService
) => {
  const imgUploadPath = await onCreateImg(descripiton, studentName, authorName, certificateIssueId, certificateId);

  // Create a document
  const doc = new PDFDocument({ size: "A4", margin: 0, layout: "landscape" });

  // Pipe its output somewhere, like to a file or HTTP response

  if (!process.env.MEDIA_UPLOAD_PATH) {
    throw new Error(" Environment variable MEDIA_UPLOAD_PATH is not set.");
  }
  const isDirExist = fs.existsSync(String(process.env.MEDIA_UPLOAD_PATH));

  if (!isDirExist) {
    throw new Error("Local directory for uploading media does not exist");
  }

  const uploadPdfPath = path.join(process.env.MEDIA_UPLOAD_PATH, `${certificateIssueId}.pdf`);
  const outputStream = doc.pipe(fs.createWriteStream(uploadPdfPath));

  doc
    .image(imgUploadPath, 0, 0, {
      width: 841,
      height: 595,
      align: "center",
      valign: "center",
    })
    .save();

  doc.end();
  outputStream.on("finish", () => {
    onComplete(uploadPdfPath, imgUploadPath as string, certificateIssueId, cms);
  });
};

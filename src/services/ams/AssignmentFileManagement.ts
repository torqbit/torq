import { createTempDir } from "@/actions/checkTempDirExist";
import { AssignmentConfig } from "@/types/courses/assignment";
import appConstant from "../appConstant";

const fs = require("fs");

class AssignmentFileManagement {
  saveToLocal = async (config: AssignmentConfig): Promise<string> => {
    let uploadFilePath = `${process.env.MEDIA_UPLOAD_PATH}/${appConstant.assignmentTempDir}/${config.userId}/course-${config.courseId}/lesson-${config.lessonId}/files`;

    return new Promise((resolve, reject) => {
      if (!createTempDir(process.env.MEDIA_UPLOAD_PATH, appConstant.assignmentTempDir)) {
        reject("Environment variable MEDIA_UPLOAD_PATH is not setted.");
      }
      if (!fs.existsSync(uploadFilePath)) {
        fs.mkdirSync(uploadFilePath, {
          recursive: true,
        });
      }

      config.codeData.map((code) => {
        if (code.length > 0) {
          const dirPath = code[0].split("/").slice(0, -1).join("/");

          if (!fs.existsSync(`${uploadFilePath}/${dirPath}`)) {
            fs.mkdirSync(`${uploadFilePath}/${dirPath}`, { recursive: true });
          }
          fs.writeFile(`${uploadFilePath}/${code[0]}`, code[code.length - 1], (err: string) => {
            if (err) {
              console.error("Error writing file:", err);
              reject(err);
            } else {
              resolve(
                `${process.env.NEXTAUTH_URL}/api/v1/course/${config.courseId}/assignment/${config.lessonId}/preview/${config.previewFileName}`
              );
            }
          });
        } else {
          reject("Unable to save the file");
        }
      });
    });
  };
}

export default new AssignmentFileManagement();

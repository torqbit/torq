const fs = require("fs");
const path = require("path");

export const createTempDir = (tempPath: string | undefined, folder: string) => {
  if (!tempPath) {
    return false;
  }

  let dirPath = path.join(String(tempPath), folder);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {
      recursive: true,
    });
  }
  return true;
};

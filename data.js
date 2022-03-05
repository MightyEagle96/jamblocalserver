import fs from "fs";

export const originPort = 3000;

export const originUrl = "http://localhost:3000";

export const path = "./backupFile.json";
export const CreateBackupFile = (array) => {
  setInterval(() => {
    if (array.length > 0) {
      fs.writeFile(path, JSON.stringify(array), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }, 10000);
};

export const RestoreBackupFile = () => {
  let restoredData = [];
  const readStream = fs.createReadStream(path);

  readStream.on("data", (data) => {
    restoredData = JSON.parse(data);
  });

  return restoredData;
};

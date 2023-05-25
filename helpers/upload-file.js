import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { v4 as uuidv4 } from 'uuid';

export const uploadFileHelper = ( files, allowedExtensions = ["png", "jpg", "jpeg", "gif"], folder = '' ) => {
  return new Promise((resolve, reject) => {
    if(!files) return;
    const { file } = files;
    const shortName = file.name.split(".");
    const extension = shortName[shortName.length - 1];

    //Validate extensions
    if (!allowedExtensions.includes(extension)) {
      return reject(`Extension ${extension} is not allow, allowed extensions: ${allowedExtensions}`);
    }

    const fileNameTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, fileNameTemp);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(fileNameTemp);
    });
  });
};

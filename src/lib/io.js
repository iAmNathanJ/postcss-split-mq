import { readFile, writeFile } from 'fs';

export const read = filePath => {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf-8', (err, fileContents) => {
      if (err) {
        reject(err);
      }

      resolve(fileContents);
    });
  });
};

export const write = (filePath, fileContents) => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, fileContents, err => {
      if (err) {
        reject(err);
      }

      resolve(fileContents);
    });
  });
};

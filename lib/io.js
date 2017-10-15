import { promisify } from 'util';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs';

const pRead = promisify(readFile);
const pWrite = promisify(writeFile);

export const read = async filePath => {
  try {
    const content = await pRead(resolve(filePath));
    return content.toString();
  } catch (e) {
    console.error(e);
  }
};

export const write = async (filePath, content) => {
  try {
    return await pWrite(resolve(filePath), content);
  } catch (e) {
    console.error(e);
  }
};

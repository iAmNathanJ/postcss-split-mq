import { resolve } from 'path';

export const processOptions = (options = {}) => {
  options.atRule = options.atRule || 'media';
  options.outpath = options.outpath ? resolve(options.outpath) : process.cwd();
  options.files = castToArray(options.files);
  options.files.forEach(file => {
    file.match = castToArray(file.match);
    file.skip = castToArray(file.skip);
    if (file.unwrap !== true) {
      file.unwrap = castToArray(file.unwrap);
    }
  });
  return options;
};

export const castToArray = (val = []) => {
  return Array.isArray(val) ? val : [val];
};

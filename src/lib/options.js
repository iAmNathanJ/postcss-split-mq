import { resolve } from 'path';

export const processOptions = (options = {}) => {
  options.outpath = options.outpath ? resolve(options.outpath) : process.cwd();
  options.files = castToArray(options.files);
  options.files.forEach(file => {
    file.match = castToArray(file.match);
    file.skip = castToArray(file.skip);
  });
  return options;
};

export const castToArray = (val = []) => {
  return Array.isArray(val) ? val : [val];
};

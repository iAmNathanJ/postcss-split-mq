export const processOptions = (options = { files: [] }) => {
  options.files = castToArray(options.files);
  options.files.forEach(file => {
    file.match = castToArray(file.match);
  });
  return options;
};

export const castToArray = (val) => {
  return Array.isArray(val) ? val : [val];
};

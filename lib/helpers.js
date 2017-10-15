import postcss from 'postcss';

export const processOptions = (options = { files: [] }) => {
  // options.files = Array.isArray(options.files) ? options : [options];
  return options;
};

export const constructTarget = option => {
  const type = option.match instanceof RegExp ? 'regexp' : 'string';
  return { ...option, type, result: postcss.root() };
};

export const createUpdater = targets => rule => {
  targets.forEach(target => {
    const find = matcher[target.type];
    if (find(target.match, rule.params)) {
      target.result.append(rule.remove());
    }
  });
};

export const matcher = {
  regex(exp, source) {
    return exp.test(source);
  },
  string(str, source) {
    return source.includes(str);
  }
};

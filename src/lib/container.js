import postcss from 'postcss';

export const createContainer = option => {
  return { ...option, result: postcss.root() };
};

export const matchAll = (arr, str) => {
  return arr.filter(regex => {
    return regex.test(str)
  }).length === arr.length;
};

export const matchAny = (arr, str) => {
  return !!arr.find(regex => {
    return regex.test(str)
  });
};

export const createUpdaterFn = containers => atRule => {
  const killRules = [];
  containers.forEach(({ skip, match, result }) => {
    if (matchAny(skip, atRule)) return;
    if (matchAny(match, atRule)) {
      result.append(atRule.clone());
      killRules.push(atRule);
    }
  });
  killRules.forEach(rule => rule.remove());
};

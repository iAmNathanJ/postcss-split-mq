import postcss from 'postcss';
import unwrapHelper from 'postcss-unwrap-helper';

export const createContainer = option => {
  return { ...option, result: postcss.root() };
};

export const matchAll = (arr, str) => {
  return arr.filter(regex => {
    return regex.test(str);
  }).length === arr.length;
};

export const matchAny = (arr, str) => {
  return Boolean(arr.find(regex => {
    return regex.test(str);
  }));
};

export const createUpdaterFn = containers => atRule => {
  const killRules = [];
  containers.forEach(({ skip, match, unwrap, result }) => {
    if (matchAny(skip, atRule)) {
      return;
    }

    if (matchAny(match, atRule)) {
      const newAtRule = atRule.clone();
      result.append(newAtRule);
      if (unwrap) {
        newAtRule.raws.before = atRule.raws.before;
        newAtRule.raws.after = atRule.raws.after;
        if ((unwrap === true) || matchAny(unwrap, atRule)) {
          unwrapHelper(newAtRule);
        }
      }

      killRules.push(atRule);
    }
  });
  killRules.forEach(rule => rule.remove());
};

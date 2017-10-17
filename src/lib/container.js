import postcss from 'postcss';

export const createContainer = option => {
  return { ...option, result: postcss.root() };
};

export const createUpdaterFn = containers => atRule => {
  const killRules = [];

  containers.forEach(container => {
    container.match.forEach(regex => {
      const previouslyFound = findRegex(regex, killRules);
      if (!previouslyFound && regex.test(atRule.params)) {
        container.result.append(atRule.clone());
        killRules.push(atRule);
      }
    });
  });

  killRules.forEach(rule => rule.remove());
};

export const findRegex = (regex, arr) => {
  return arr.find(elem => regex.toString() === elem.toString());
};

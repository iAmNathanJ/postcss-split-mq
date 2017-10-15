import postcss from 'postcss';

export const createContainer = option => {
  return { ...option, result: postcss.root() };
};

export const createUpdaterFn = containers => rule => {
  containers.forEach(container => {
    container.match.forEach(regex => {
      if (regex.test(rule.params)) {
        container.result.append(rule.remove());
      }
    });
  });
};

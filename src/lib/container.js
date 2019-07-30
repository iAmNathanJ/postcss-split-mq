import postcss from 'postcss';
import unwrapNode from 'postcss-unwrap-helper';

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

export const createContainerMatchesFn = node => (skip, match) => !matchAny(skip, node) && matchAny(match, node);

export const createUpdaterFn = (containers, additive) => (node, index, force = false) => {
  const killRules = [];
  const containerMatches = createContainerMatchesFn(node);
  containers.forEach(({ skip, match, unwrap, result }, currentIndex) => {
    const atRuleMatches = !force && containerMatches(skip, match);
    const additiveMatches = !force && additive &&
      !containers.some(({ skip, match }, index) => (index > currentIndex) && containerMatches(skip, match));
    if (force || atRuleMatches || additiveMatches) {
      const newNode = node.clone();
      result.append(newNode);
      newNode.raws.before = node.raws.before;
      newNode.raws.after = node.raws.after;

      if (unwrap && !force) {
        if ((unwrap === true) || matchAny(unwrap, node)) {
          unwrapNode(newNode);
        }
      }

      if (atRuleMatches) {
        killRules.push(node);
      }
    }
  });
  killRules.forEach(rule => rule.remove());
};

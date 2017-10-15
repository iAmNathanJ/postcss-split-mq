require('babel-polyfill');

import postcss from 'postcss';
import { join } from 'path';
import { write } from './lib/io';
import { processOptions, constructTarget, createUpdater } from './lib/helpers';

process.on('unhandledRejection', console.error);

const plugin = postcss.plugin('postcss-split-mq', options => {
  options = processOptions(options);

  return async function(css, result) {
    // setup target mq files
    const targets = options.files.map(constructTarget);
    const updateTargets = createUpdater(targets);

    // do the deed
    css.walkAtRules('media', updateTargets);

    // write files
    await Promise.all(
      targets.map(target => {
        const { outpath = options.outpath, name, result } = target;
        return write(join(outpath, name), result.toString());
      })
    );

    return result;
  };
});

export default plugin;

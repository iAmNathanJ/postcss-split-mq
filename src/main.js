import 'babel-polyfill'; // eslint-disable-line import/no-unassigned-import
import { join } from 'path';
import postcss from 'postcss';
import { write } from './lib/io';
import { processOptions } from './lib/options';
import { createContainer, createUpdaterFn } from './lib/container';

process.on('unhandledRejection', console.error);

const plugin = postcss.plugin('postcss-split-mq', options => {
  options = processOptions(options);

  return async function (CSS) {
    // Setup containers for mq files
    const containers = options.files.map(createContainer);
    const updateContainers = createUpdaterFn(containers);

    // Do the deed
    CSS.walkAtRules(options.atRule, updateContainers);

    // Write mq files
    await Promise.all(
      containers.map(container => {
        const { outpath = options.outpath, name, result } = container;
        return write(join(outpath, name), result.toString());
      })
    );
  };
});

export default plugin;

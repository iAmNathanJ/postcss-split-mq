import test from 'ava';
import postcss from 'postcss';
import postcssSplitMq from '../src/main';
import { read } from '../lib/io';

test.skip('can be configured with a single object', async t => {
  const opts = {
    path: './test/build',
    filename: 'small.css',
    match: 'min-width: 300px'
  };
  await t.notThrows(() => postcss([postcssSplitMq(opts)]));
});

test.skip('can be configured with an array of objects', async t => {
  const opts = [
    {
      path: './test/build',
      filename: 'small.css',
      match: 'min-width: 300px'
    },
    {
      path: './test/build',
      filename: 'medium.css',
      match: 'min-width: 720px'
    }
  ];
  await t.notThrows(() => postcss([postcssSplitMq(opts)]));
});

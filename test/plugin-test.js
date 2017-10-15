import test from 'ava';
import postcss from 'postcss';
import postcssSplitMq from '../src/main';
import { read, write } from '../src/lib/io';

test('it returns a css string', async t => {
  const css = await read('./test/fixtures/test.css');
  const result = await postcss([postcssSplitMq]).process(css);
  t.is(typeof result.css, 'string');
});

test('it strips media queries', async t => {
  const css = await read('./test/fixtures/test.css');
  const opts = {
    outpath: './test/build',
    files: [{
      name: 'small.css',
      match: 'min-width: 300px'
    }]
  };
  const result = await postcss([postcssSplitMq(opts)]).process(css);
  t.is(result.css.indexOf('min-width: 300px'), -1);
});

test('it strips media queries', async t => {
  const css = await read('./test/fixtures/test.css');
  const opts = {
    outpath: './test/build',
    files: [{
      name: 'medium.css',
      match: 'min-width: 600px'
    }]
  };
  const result = await postcss([postcssSplitMq(opts)]).process(css);
  t.is(result.css.indexOf('min-width: 600px'), -1);
});

test('it strips media queries', async t => {
  const css = await read('./test/fixtures/test.css');
  const opts = {
    outpath: './test/build',
    files: [{
      name: 'medium.css',
      match: 'min-width: 600px'
    }]
  };
  const result = await postcss([postcssSplitMq(opts)]).process(css);
  await write('./test/build/no-600.css', result.css);
  t.is(result.css.indexOf('min-width: 600px'), -1);
});

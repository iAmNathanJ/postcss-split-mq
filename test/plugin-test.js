import test from 'ava';
import postcss from 'postcss';
import postcssSplitMq from '../src/main';
import { exec } from 'shelljs';
import { read, write } from '../src/lib/io';

const OPTS = {
  outpath: './test/build',
  files: [{
    name: '300.css',
    match: /min-width:\s*300px/
  }]
}

let CSS;

test.before(async () => {
  CSS = await read('./test/fixtures/test.css');
});

test.afterEach(() => {
  exec('rm ./test/build/*', { silent: true });
});

test('it returns a css string', async t => {
  const { css } = await postcss([postcssSplitMq]).process(CSS);
  t.is(typeof css, 'string');
});

test('it strips media queries', async t => {
  const { css } = await postcss([postcssSplitMq(OPTS)]).process(CSS);
  t.false(css.includes('min-width: 300px'));
});

test('it strips multiple media queries', async t => {
  const opts = {
    outpath: './test/build',
    files: [{
      name: '300-600.css',
      match: [
        /min-width:\s*300px/,
        /min-width:\s*600px/
      ]
    }]
  };
  const { css } = await postcss([postcssSplitMq(opts)]).process(CSS);
  t.false(
    css.includes('min-width: 300px') &&
    css.includes('min-width: 600px')
  );
});

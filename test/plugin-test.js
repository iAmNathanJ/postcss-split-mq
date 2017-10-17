import test from 'ava';
import postcss from 'postcss';
import tempy from 'tempy';
import splitMQ from '../dist/main';
import { existsSync as fileExists } from 'fs';
import { exec } from 'shelljs';
import { read, write } from '../dist/lib/io';

let CSS;

test.before(async () => {
  CSS = await read('./test/fixtures/test.css');
});

test('it returns a css string', async t => {
  const { css } = await postcss([splitMQ]).process(CSS);
  t.is(typeof css, 'string');
});

test('it strips media queries', async t => {
  const opts = {
    outpath: tempy.directory(),
    files: [{
      name: '300.css',
      match: /min-width:\s*300px/
    }]
  };
  const { css } = await postcss([splitMQ(opts)]).process(CSS);
  t.false(css.includes('min-width: 300px'));
});

test('it strips multiple media queries', async t => {
  const opts = {
    outpath: tempy.directory(),
    files: [{
      name: '300-600.css',
      match: [
        /min-width:\s*300px/,
        /min-width:\s*600px/
      ]
    }]
  };
  const { css } = await postcss([splitMQ(opts)]).process(CSS);
  t.false(
    css.includes('min-width: 300px') &&
    css.includes('min-width: 600px')
  );
});

test('it creates the specified files', async t => {
  const dir = tempy.directory();
  const opts = {
    outpath: dir,
    files: [{
      name: 'this-will-exist.css',
      match: /min-width:\s*300px/
    }]
  };
  await postcss([splitMQ(opts)]).process(CSS);

  t.true(fileExists(`${dir}/this-will-exist.css`));
});

test('it places found media queries in the specified files', async t => {
  const dir = tempy.directory();
  const opts = {
    outpath: dir,
    files: [{
      name: '300.css',
      match: /min-width:\s*300px/
    }]
  };
  await postcss([splitMQ(opts)]).process(CSS);

  const output = await read(`${dir}/300.css`);

  t.true(output.includes('min-width: 300px'));
});

test('it will repeat a found media query in multiple files', async t => {
  const dir = tempy.directory();
  const opts = {
    outpath: dir,
    files: [{
      name: 'file1.css',
      match: /min-width:\s*300px/
    },{
      name: 'file2.css',
      match: /min-width:\s*300px/
    }]
  };
  await postcss([splitMQ(opts)]).process(CSS);

  const [ file1, file2 ] = await Promise.all([
    read(`${dir}/file1.css`),
    read(`${dir}/file2.css`)
  ]);

  t.true(
    file1.includes('min-width: 300px') &&
    file2.includes('min-width: 300px')
  );
});

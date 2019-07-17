import { existsSync as fileExists } from 'fs';
import test from 'ava';
import postcss from 'postcss';
import tempy from 'tempy';
import splitMQ from '../dist/main';
import { read } from '../dist/lib/io';

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

test('it places captured media queries in the specified files', async t => {
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

test('it will repeat a captured media query in multiple files', async t => {
  const dir = tempy.directory();
  const opts = {
    outpath: dir,
    files: [{
      name: 'file1.css',
      match: /min-width:\s*300px/
    }, {
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

test('it will skip queries if `skip` expressions are configured', async t => {
  const dir = tempy.directory();
  const opts = {
    outpath: dir,
    files: [{
      name: 'skip.css',
      match: /min-width:\s*9999px/,
      skip: /min-width:\s*1111px/
    }]
  };
  await postcss([splitMQ(opts)]).process(CSS);

  const output = await read(`${dir}/skip.css`);

  t.false(output.includes('min-width: 9999px'));
});

test('it will unwrap specified media queries when the option specified', async t => {
  const dir = tempy.directory();
  const opts = {
    outpath: dir,
    files: [{
      name: 'file1.css',
      match: [
        /min-width:\s*300px/,
        /min-width:\s*400px/
      ],
      unwrap: true
    }, {
      name: 'file2.css',
      match: /./,
      skip: [
        /min-width:\s*300px/,
        /min-width:\s*400px/
      ],
      unwrap: /min-width:\s*500px/
    }]
  };
  await postcss([splitMQ(opts)]).process(CSS);

  const [ file1, file2 ] = await Promise.all([
    read(`${dir}/file1.css`),
    read(`${dir}/file2.css`)
  ]);

  t.false(
    file1.includes('@media') ||
    file1.includes('min-width'),
    'file 1 should not include any media query'
  );

  t.false(
    file2.includes('min-width: 300px') ||
    file2.includes('min-width: 400px'),
    'file 2 should not include skipped media query'
  );

  t.false(
    file2.includes('min-width: 500px'),
    'file 2 should not include unwrapped media query'
  );

  t.true(
    file2.includes('min-width: 600px') &&
    file2.includes('min-width: 1111px') &&
    file2.includes('min-width: 9999px'),
    'file 2 should include non-unwrapped media queries'
  );
});

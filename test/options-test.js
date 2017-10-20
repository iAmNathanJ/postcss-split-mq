import test from 'ava';
import tempy from 'tempy';
import { join } from 'path';
import { processOptions } from '../dist/lib/options';

test('`options.outpath` will be cwd if not specified', t => {
  const options = processOptions();
  t.is(options.outpath, process.cwd());
});

test('`options.outpath` can be set', t => {
  const options = processOptions({
    outpath: './css'
  });
  t.is(options.outpath, join(process.cwd(), 'css'));
});

test('`options.files` cast to an array', t => {
  const options = processOptions({
    outpath: tempy.directory(),
    files: {}
  });
  t.true(Array.isArray(options.files));
});

test('`files.match` cast to an array', t => {
  const options = processOptions({
    outpath: tempy.directory(),
    files: [{
      match: /some-regex/
    }]
  });
  t.true(Array.isArray(options.files[0].match));
});

test('`files.skip` cast to an array', t => {
  const options = processOptions({
    outpath: tempy.directory(),
    files: [{
      skip: /some-regex/
    }]
  });
  t.true(Array.isArray(options.files[0].skip));
});

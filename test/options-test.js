import test from 'ava';
import tempy from 'tempy';
import { processOptions } from '../dist/lib/options';

test('`files` will be converted to an array if it is passed as a single object', t => {
  const options = processOptions({
    outpath: tempy.directory(),
    files: {
      name: 'some.css',
      match: [
        /some-regex/,
        /some-other-regex/
      ]
    }
  });
  t.true(Array.isArray(options.files));
});

test('`match` will be converted to an array if it is passed as a single regex', t => {
  const options = processOptions({
    outpath: tempy.directory(),
    files: [{
      name: 'some.css',
      match: /some-regex/
    }]
  });
  t.true(Array.isArray(options.files[0].match));
});

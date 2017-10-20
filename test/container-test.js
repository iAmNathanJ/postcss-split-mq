import test from 'ava';
import postcss from 'postcss';
import { createContainer, createUpdaterFn } from '../dist/lib/container';

test('createContainer returns an object with an added `result` property', t => {
  const container = createContainer({ foo: true });
  t.truthy(container.result);
});

test('container.result will be a postcss container', t => {
  const container = createContainer({ foo: true });
  t.deepEqual(container.result, postcss.root());
});

test('createUpdaterFn creates a function', t => {
  const containers = [ createContainer({ foo: true })];
  const updateContainers = createUpdaterFn(containers);
  t.is(typeof updateContainers, 'function');
});

test('updater function updates a set of containers', t => {
  const containers = [
    createContainer({ match: [/300px/], skip: [] }),
    createContainer({ match: [/print/], skip: [] })
  ];
  const updateContainers = createUpdaterFn(containers);
  const root = postcss.parse('@media (min-width: 300px) {} @media print {}');
  const rule1 = root.first;
  const rule2 = root.last;

  updateContainers(rule1);
  updateContainers(rule2);

  t.is(containers[0].result.toString(), '@media (min-width: 300px) {}');
  t.is(containers[1].result.toString(), '@media print {}');
});

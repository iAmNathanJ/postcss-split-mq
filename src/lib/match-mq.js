import util from 'util';
import mqParser from 'postcss-media-query-parser';

mqParser('(min-width: 100px), no print').walk('media-query', node => {
  node.walk('media-feature-expression', feature => {
    console.log(feature);
  });
});

// console.log(
//   util.inspect(mqs, {
//     showHidden: false,
//     depth: null
//   })
// );

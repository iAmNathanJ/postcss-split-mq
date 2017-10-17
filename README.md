# postcss-split-mq

[![Build Status](https://semaphoreci.com/api/v1/iamnathanj/postcss-split-mq/branches/master/badge.svg)](https://semaphoreci.com/iamnathanj/postcss-split-mq) [![Maintainability](https://api.codeclimate.com/v1/badges/c0e76f3f63757fb5e224/maintainability)](https://codeclimate.com/github/iAmNathanJ/postcss-split-mq/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c0e76f3f63757fb5e224/test_coverage)](https://codeclimate.com/github/iAmNathanJ/postcss-split-mq/test_coverage)

PostCSS plugin to split specific media queries into separate files.

## Usage

Assuming a CSS file like this:
```css
/* main.css */

body {
  color: tangerine;
}

@media (min-width: 1024px) {
  body {
    color: pink;
  }
}
```

You can split it like this:
```js
const postcss = require('postcss');
const splitMq = require('postcss-split-mq');

const CSS = readFile('main.css');

const options = {
  outpath: './',
  files: [
    {
      name: 'wide.css',
      match: /min-width:\s*1024px/
    }
  ]
};

postcss([splitMq(options)])
.process(CSS)
.then(result => {
  // result will be a postcss container with the remaining CSS
  // after striping all media queries that match the `files` option
  writeFile('remaining.css', result.css)
});
```

And that will give you:
```css
/* remaining.css */

body {
  color: tangerine;
}
```

and:
```css
/* wide.css */

@media (min-width: 1024px) {
  body {
    color: pink;
  }
}
```

---

You can create multiple `files` with multiple `match` criteria per file. Media queries are captured for a given file if _any_ of its match expressions are found.

e.g.
```js
options = {
  outpath: './',
  files: [
    {
      name: 'medium.css',
      match: [
        /min-width:\s*(640px|40r?em)/,
        /max-width:\s*(800px|50r?em)/
      ]
    },
    {
      name: 'wide.css',
      match: /min-width:\s*1024px/
    }
  ]
};
```

---

This can be improved. Contributions are welcome. Create an issue if you see a problem or to ask a question.

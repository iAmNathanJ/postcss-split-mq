# postcss-split-mq

[![Test Coverage](https://api.codeclimate.com/v1/badges/c0e76f3f63757fb5e224/test_coverage)](https://codeclimate.com/github/iAmNathanJ/postcss-split-mq/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/c0e76f3f63757fb5e224/maintainability)](https://codeclimate.com/github/iAmNathanJ/postcss-split-mq/maintainability) [![Build Status](https://semaphoreci.com/api/v1/iamnathanj/postcss-split-mq/branches/master/badge.svg)](https://semaphoreci.com/iamnathanj/postcss-split-mq)

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

## Options

### `atRule`

Specify a custom name by passing `string` or `RegExp`, e.g. `/^(media|element)$/`. Defaults to `media`.

### `outpath`

Output path.

### `files`

An array of objects specifying particular split files.

#### `name`

Output filename.

#### `match`

A `RegExp` or array of alternative `RegExp`s to test media queries against. If pass, the media query will be moved to the file.

#### `skip`

Inverserd `match`: if media query passes, won't be included in the file.

#### `unwrap`

If set to `true`, all media queries will get unwrapped. Accepts also `RegExp`(s), similarly to `match` option, to limit the unwrapped queries.

The following config:

```js
options = {
  outpath: './',
  files: [
    {
      name: 'medium.css',
      match: [
        /min-width:\s*600px/,
        unwrap: true
      ]
    },
    {
      name: 'large.css',
      skip: /min-width:\s*600px/,
      unwrap: /min-width:\s*960px/
    }
  ]
}
```

With the following input CSS:

```css
div {
  color: white;
}

@media screen and (min-width: 600px) {
  div {
    color: green;
  }
}

@media screen and (min-width: 960px) {
  div {
    color: red;
  }
}

@media screen and (min-width: 1200px) {
  div {
    color: black;
  }
}
```

Will give:

```css
/* main.css */
div {
  color: white;
}

/* medium.css */
div {
  color: green;
}

/* large.css */
div {
  color: red;
}

@media screen and (min-width: 1200px) {
  div {
    color: black;
  }
}
```

And can be included like this:

```html
<link rel="stylesheet" href="main.css">
<link rel="stylesheet" href="medium.css" media="screen and (min-width: 600px)">
<link rel="stylesheet" href="large.css" media="screen and (min-width: 960px)">
```

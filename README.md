# Prepend text to a file / group of files
###  Example(s):
  - `prepend-header src-web/foo.js 'header.config.js'  (single file)`
  - `prepend-header src-web/**/*.js 'header.config.js'  (all files matching glob)`.

Successful Output should look like:
```
[FILES from src-web/**/*]
Prepended to src-web/after1.js
Prepended to src-web/foo/after2.js
Prepended to src-web/foo/after3.js
```

## Local Project:

-  `npm i prepend-header --save-dev`

2. create a `header.config.js` in your root that looks something like:
```js
const year = new Date().getFullYear();
const text = `/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation ${year}. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
`;

const match = 'Reserved'; // avoid double-prepends. if this word exists in a file, that file gets skipped.
module.exports = {
  text,
  match,
};
```
3. In package.json do:
```json
"scripts" {
  "prepend-header": "prepend-header src/**/*.js header.config.js",
}
```
4. `npm run prepend-header`
----
## Run once with NPX
1. create a header.config.js in your current working directory see above for format)
2. `npx prepend-header src/**/*.js header.config.js`


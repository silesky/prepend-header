# Prepend text to a file / group of files

Works recursively:

## Set-up:

1. create a `header.js` that looks something like:
```js
const year = new Date().getFullYear();
const txt = `/*******************************************************************************
  * Licensed Materials - Property of IBM
  * (c) Copyright IBM Corporation ${year}. All Rights Reserved.
  *
  * Note to U.S. Government Users Restricted Rights:
  * Use, duplication or disclosure restricted by GSA ADP Schedule
  * Contract with IBM Corp.
  *******************************************************************************/\n\n`;

module.exports = txt;
```

2. Run a CLI command.
- format is: `node ./node_modules/prepend-header/app.js <HEADERPATH> <GLOB>`

###  Example(s):
  - `node ./node_modules/prepend-header/app.js './headers/header.js' src-web/**/*.js ` (all js files matching glob).
  - `node ./node_modules/prepend-header/app.js './headers/header.js' src-web/after.js` (single file)

Successful Output should look like:
```
[FILES from src-web/**/*]
Prepended license to src-web/after1.js
Prepended license to src-web/foo/after2.js
Prepended license to src-web/foo/after3.js
```

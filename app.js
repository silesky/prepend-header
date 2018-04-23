/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const prependFile = require('prepend-file');
const glob = require('glob-fs')({ gitignore: false });
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));
const isGlob = require('is-glob');

const year = new Date().getFullYear()
const header = `/*******************************************************************************
  * Licensed Materials - Property of IBM
  * (c) Copyright IBM Corporation ${year}. All Rights Reserved.
  *
  * Note to U.S. Government Users Restricted Rights:
  * Use, duplication or disclosure restricted by GSA ADP Schedule
  * Contract with IBM Corp.
  *******************************************************************************/\n\n`;

const readFilePromise = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

const prependLicense = filePath =>
  new Promise((resolve, reject) => {
    prependFile(filePath, header, err => {
      if (err) reject(err);
      console.log(`Prepended license to ${filePath}`);
      resolve();
    });
  });

const conditionallyReadAndPrependFile = path => {
  readFilePromise(path).then(output => {
    // don't accidentally double-append.
    if (!output.includes(header)) {
      prependLicense(path);
    }
  });
};

const isFile = path => {
  return fs.existsSync(path) ? !fs.statSync(path).isDirectory() : false;
};

const getFilesFromGlob = globPattern => {
  try {
    const files = glob.readdirSync(globPattern).filter(isFile);
    return files;
  } catch (err) {
    return [];
  }
};

// all this complex logic to basically check if we user is passing a glob (e.g. [src-web/**/*.js])
// or an array of files
// (natural bash globbing e.g  [ 'src-web/thing/thing2/after.scss', 'src-web/thing/thing2/after1.scss'
// so essentially, whether or not the thing has quotes should not matter.
const flatten = arr => [].concat(...arr);

const filesOrGlobs = flatten(Object.values(args));
const fileList = filesOrGlobs.filter(isFile);
const globList = filesOrGlobs.filter(isGlob);

if (!filesOrGlobs.length) {
  console.log(
    '--> Missing argument. Please include a valid directory path such as src-web or .',
  );
} else {
  // map over all files and prepend the license.
  if (globList.length) {
    const files = flatten(globList.map(getFilesFromGlob));
    if (files.length) {
      files.forEach(conditionallyReadAndPrependFile);
    } else {
      console.log('No files from glob found.');
    }
  }
  if (fileList.length) {
    fileList.forEach(conditionallyReadAndPrependFile);
  }
}

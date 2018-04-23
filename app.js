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

const flatten = arr => [].concat(...arr);
const [headerPath, ...filesOrGlobs] = flatten(Object.values(args));

let headerTxt = '';
try {
  headerTxt = require(headerPath);
} catch (err) {
  console.log(
    `Unable to prepend, because no valid header.js found. Header argument passed: ${headerPath}`,
  );
  return null;
}

const readFilePromise = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

const prependHeader = filePath =>
  new Promise((resolve, reject) => {
    // grab headerTxt from global
    prependFile(filePath, headerTxt, err => {
      if (err) {
        console.log('Could not prepend header.');
        reject(err);
      }
      console.log(`Prepended license to ${filePath}`);
      resolve();
    });
  });

const conditionallyReadAndPrependHeaderToFile = filePath => {
  readFilePromise(filePath).then(output => {
    // don't accidentally double-append.
    if (!output.includes(headerTxt)) {
      prependHeader(filePath);
    }
  });
};

const isFile = path => {
  return fs.existsSync(path) ? !fs.statSync(path).isDirectory() : false;
};

// all this complex logic to basically check if we user is passing a glob (e.g. [src-web/**/*.js])
// or an array of files
// (natural bash globbing e.g  [ 'src-web/thing/thing2/after.scss', 'src-web/thing/thing2/after1.scss'
// so essentially, whether or not the thing has quotes should not matter.

const getFilesFromGlob = globPattern => {
  try {
    const files = glob.readdirSync(globPattern).filter(isFile);
    return files;
  } catch (err) {
    return [];
  }
};

const fileList = filesOrGlobs.filter(isFile);
const globList = filesOrGlobs.filter(isGlob);

if (!filesOrGlobs.length) {
  console.log(
    '--> Missing argument. Please include a valid file or directory path such as src-web or .',
  );
} else {
  // map over all files and prepend the license.
  if (globList.length) {
    const files = flatten(globList.map(getFilesFromGlob));
    if (files.length) {
      files.forEach(conditionallyReadAndPrependHeaderToFile);
    } else {
      console.log('No files from glob found.');
    }
  }
  if (fileList.length) {
    fileList.forEach(conditionallyReadAndPrependHeaderToFile);
  }
}

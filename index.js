#!/usr/bin/env node

const prependFile = require('prepend-file');
const glob = require('glob-fs')({ gitignore: false });
const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const isGlob = require('is-glob');
const appPath = require('path').dirname(require.main.filename);
const { moduleIsAvailable, flatten, readFilePromise } = require('./utils');
const flatArgs = flatten(Object.values(args));

if (!flatArgs.length) {
  console.log(
    `
    version: ${process.env.npm_package_version}
    usage: prepend-header [filepath/globpath] [headerpath]
    example: prepend-header src/**/*.scss header.config.js
  `)
  return;
}
const filesOrGlobs = flatArgs.slice(0, flatArgs.length - 1);
const headerPath = flatArgs[flatArgs.length - 1];

let header = {};
if (moduleIsAvailable(headerPath)) {
  header = require(headerPath);
  // accept optional header.js
} else if (moduleIsAvailable(path.join(appPath, headerPath))) {
  header = require(path.join(appPath, headerPath));
} else if (moduleIsAvailable(`${appPath}/header`)) {
  header = require(`${appPath}/header`);
} else {
  console.log(
    `Unable to prepend, because no valid header javascript file in app root or passed as path. Argument passed: ${headerPath}`);
  return null;
}

const prependHeader = filePath =>
  new Promise((resolve, reject) => {
    // grab headerTxt from global
    prependFile(filePath, header.text, err => {
      if (err) {
        console.log('Could not prepend header.');
        reject(err);
      }
      console.log(`Prepended to ${filePath}`);
      resolve();
    });
  });

const conditionallyReadAndPrependHeaderToFile = filePath => {
  readFilePromise(filePath).then(output => {
    // don't accidentally double-append.
    if (!output.includes(header.match)) {
      prependHeader(filePath);
    } else {
      console.log(`(Header already exists in ${filePath}.)`)
    }
  });
};

// all this complex logic to basically check if we user is passing a glob (e.g. [src-web/**/*.js])
// or an array of files
// (natural bash globbing e.g  [ 'src-web/thing/thing2/after.scss', 'src-web/thing/thing2/after1.scss'

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

// so essentially, whether or not the thing has quotes should not matter.
const fileList = filesOrGlobs.filter(isFile);
const globList = filesOrGlobs.filter(isGlob);

if (!filesOrGlobs.length) {
  console.log(
    '--> Missing files argument. Please include a valid file or directory path such as src-web.');
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

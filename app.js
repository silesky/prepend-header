// check if has 'ibm' copyright string
const fs = require('fs');
const path = require('path');
const prependFile = require('prepend-file');
const [_, __, cliArg] = process.argv;

const header = `/*******************************************************************************
  * Licensed Materials - Property of IBM
  * (c) Copyright IBM Corporation 2018. All Rights Reserved.
  *
  * Note to U.S. Government Users Restricted Rights:
  * Use, duplication or disclosure restricted by GSA ADP Schedule
  * Contract with IBM Corp.
  *******************************************************************************/\n\n`;

if (!cliArg) {
  console.log('--> Missing argument. Please include a valid directory path such as src-web or .');
  return;
}

const readFile = filePath =>
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

// don't double append
const conditionallyReadAndPrependFile = path => {
  readFile(path).then(output => {
    if (!output.includes('Licensed Materials - Property of IBM')) {
      prependLicense(path);
    }
  });
};

// recursively get array of file paths from a directory path.
const getAllFiles = dir => {
  let dirSync;
  try {
    dirSync = fs.readdirSync(dir);
  } catch (err) {
    console.log('No directory found.');
    return [];
  }
  return dirSync.reduce((files, file) => {
    const name = path.join(dir, file);
    const isDir = fs.statSync(name).isDirectory();
    return isDir
      ? [...files, ...getAllFiles(name)]
      : [...files, name];
  }, []);
};

// map over all files and prepend the license.
getAllFiles(cliArg)
  .filter(eachPath => /jsx?\b/.test(eachPath))
  .map(conditionallyReadAndPrependFile);

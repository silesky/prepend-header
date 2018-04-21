/*******************************************************************************
  * Licensed Materials - Property of IBM
  * (c) Copyright IBM Corporation 2018. All Rights Reserved.
  *
  * Note to U.S. Government Users Restricted Rights:
  * Use, duplication or disclosure restricted by GSA ADP Schedule
  * Contract with IBM Corp.
  *******************************************************************************/

const path = require('path');
const prependFile = require('prepend-file');
const glob = require('glob-fs')({ gitignore: false });
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2))

const header = `/*******************************************************************************
  * Licensed Materials - Property of IBM
  * (c) Copyright IBM Corporation 2018. All Rights Reserved.
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

// don't double append
const conditionallyReadAndPrependFile = path => {
  readFilePromise(path).then(output => {
    if (!output.includes('Licensed Materials - Property of IBM')) {
      prependLicense(path);
    }
  });
};

const getFilesFromGlob = globPattern => {
  const isFile = (path) => !fs.statSync(path).isDirectory();
  try {
    const files = glob.readdirSync(globPattern).filter(isFile)
    return files;
  } catch (err) {
    console.log('(Not a glob, maybe quotes were forgotten? Treating as single file.)');
    conditionallyReadAndPrependFile(globPattern)
    return [];
  }
};

const { _: [ userGlob ] } = args;
if (!userGlob) {
  console.log(
    '--> Missing argument. Please include a valid directory path such as src-web or .',
  );
} else {
  // map over all files and prepend the license.
  getFilesFromGlob(userGlob)
    .map(conditionallyReadAndPrependFile);
}

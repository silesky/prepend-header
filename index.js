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
  *******************************************************************************/

  `;

const prependLicense = filePath =>
  new Promise((resolve, reject) => {
    prependFile(filePath, _, err => {
      if (err) reject(err);
      console.log(`Prepended license to ${filePath}`);
      resolve();
    });
  });
/**
 * Find all files inside a dir, recursively.
 * @function getAllFiles
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
const getAllFiles = dir => {
  let dirSync;
  try {
    dirSync = fs.readdirSync(dir);
  } catch (err) {
    console.log('No directory found.');
  }
  return dirSync.reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);
};

// map over all files and prepend the license.
getAllFiles(cliArg).map(prependLicense);

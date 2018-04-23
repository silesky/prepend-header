const fs = require('fs');

exports.moduleIsAvailable = path => {
  try {
    require.resolve(path);
    return true;
  } catch (e) {
    return false;
  }
};

exports.flatten = arr => [].concat(...arr);

exports.readFilePromise = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

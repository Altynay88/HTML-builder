const fs = require("fs");
const path = require("path");

const files = path.join(__dirname, "files");
const filesCopy = path.join(__dirname, "files-copy");

async function copyDir(source, copy) {
  fs.mkdir(copy, {recursive: true}, err => {
    if (err) {
      throw new Error('There is an error!')
    }
    console.log('YOOOOHOOOOO!!! File is created!')
  });

  fs.readdir(source, {withFileTypes: true}, (err, files) => {
    err ? console.log(err) : null;
    files.forEach(file => {
      const fileName = file.name;
      if (file.isFile()) {
        let filePath;
        let copyfilePath;
        filePath = path.join(source, fileName);
        copyfilePath = path.join(copy, fileName);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            throw err;
          } else {
            fs.copyFile(filePath, copyfilePath, err => {
              err ? console.log(err) : null;
            });
          }
        });
      } else {
        const subFolder = path.join(source, file.name);
        const copySubFolder = path.join(copy, file.name);
        copyDir(subFolder, copySubFolder);
      }
    });
  })
}

fs.rm(filesCopy, {
    recursive: true,
    force: true
  }, () =>
  copyDir(files, filesCopy)
);
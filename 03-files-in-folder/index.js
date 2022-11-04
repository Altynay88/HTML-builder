const fs = require("fs");
const path = require("path");

const secretFolder = path.join(__dirname, "secret-folder");

fs.readdir(secretFolder, {
  withFileTypes: true
}, (err, files) => {
  err ? console.log(err) : null;
  files.forEach((file) => {
    if (file.isFile()) {
      const fileName = file.name;
      const filePath = path.join(secretFolder, fileName);
      fs.stat(filePath, (err, stats) => {
        const index = path.resolve(fileName);
        const obj = path.parse(index);
        err ? console.log(err) : null;
        console.log(`${obj.name} - ${obj.ext.slice(1)} - ${(stats.size / 1024).toFixed(3)} kb`);
      });
    };
  });
});
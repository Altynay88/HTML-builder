const fs = require("fs");
const path = require("path");

const styles = path.join(__dirname, "styles");
const bundle = path.join(__dirname, "project-dist", "bundle.css");
const stream = fs.createWriteStream(path.join(bundle));

fs.readdir(styles, {
  withFileTypes: true
}, (err, files) => {
  err ? console.log(err) : null;
  files.forEach(file => {
    if (file.isFile()) {
      const fileName = file.name;
      const filePath = path.join(styles, fileName);
      fs.stat(filePath, (err, stats) => {
        const index = path.resolve(fileName);
        const obj = path.parse(index);
        err ? console.log(err) : null;
        if (obj.ext === '.css') {
          const readStream = fs.createReadStream(filePath, 'utf-8');
          readStream.on('data', chunk => stream.write(chunk + "\n\n"));
          readStream.on('error', error => console.log('Error', error.message));
        }
      });
    }
  });
});
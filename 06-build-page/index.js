const path = require("path");
const fs = require("fs");

const projectDist = path.join(__dirname, "project-dist");
const index = path.join(projectDist, "index.html");
const style = path.join(projectDist, "style.css");
const assets = path.join(projectDist, "assets");
const template = path.join(__dirname, "template.html");
const stylesPath = path.join(__dirname, "styles");
const assetsPath = path.join(__dirname, "assets");
const components = path.join(__dirname, "components");

fs.mkdir(projectDist, {
  recursive: true
}, (err) => {
 err ? console.log(err) : null;
});

const readStream = fs.createReadStream(template, "utf-8");
let temp = "";
readStream.on("data", (chunk) => {temp += chunk;});
readStream.on("end", () => {bumpComp(temp);});
readStream.on("error", (error) => console.log("Error", error.message));

async function bumpComp(text) {
  fs.readdir(components, {
    withFileTypes: true
  }, (err, files) => {
  err ? console.log(err) : null;
    const tags = text.match(/{{(.*?)}}/g);
    tags.forEach((tagItem) => {
      const tag = tagItem
        .split("")
        .filter((e) => !/[\{\}]/g.test(e))
        .join("")
        .trim();
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(components, file.name);
          fs.stat(filePath, (err, stats) => {
            const fileObj = path.parse(path.resolve(file.name));
            if (err) {
              throw err;
            } else {
              if (fileObj.ext === ".html" && fileObj.name === tag) {
                let component = "";
                const readFile = fs.createReadStream(filePath, "utf-8");
                readFile.on("data", (chunk) => {component += chunk;});
                readFile.on("end", () => {
                  text = text.replace(tagItem, "\n" + component + "\n");
                  const writeInd = fs.createWriteStream(index);
                  writeInd.write(text);
                });
                readFile.on("error", (error) =>console.log("Error", error.message)
                );
              };
            };
          });
        };
      });
    });
  });
};

const writeStream = fs.createWriteStream(path.join(style));
fs.readdir(stylesPath, {
  withFileTypes: true
}, (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(stylesPath, file.name);
        fs.stat(filePath, (err, stats) => {
          const obj = path.parse(path.resolve(file.name));
          if (err) {
            throw err;
          } else {
            if (obj.ext === ".css") {
              const readStyles = fs.createReadStream(filePath, "utf-8");
              readStyles.on("data", (chunk) =>writeStream.write(chunk + "\n\n"));
              readStyles.on("error", (error) =>console.log("Error", error.message));
            };
          };
        });
      };
    });
  };
});

async function copyDir(source, copy) {
  fs.mkdir(copy, {
    recursive: true
  }, (err) => {
  err ? console.log(err) : null;
  });
  fs.readdir(source, {
    withFileTypes: true
  }, (err, files) => {
    if (err) {
      throw err;
    } else {
      files.forEach((file) => {
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
              fs.copyFile(filePath, copyfilePath, (err) => {
               err ? console.log(err) : null;
              });
            }
          });
        } else {
          const subFolder = path.join(source, file.name);
          const copySubFolder = path.join(copy, file.name);
          copyDir(subFolder, copySubFolder);
        };
      });
    };
  });
}
fs.rm(assets, {
    recursive: true,
    force: true
  }, () =>
  copyDir(assetsPath, assets)
);
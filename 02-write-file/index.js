const fs = require("fs");
const path = require("path");

let stream = fs.createWriteStream(path.join(__dirname, "text.txt"));

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.write("Write anything you want, please?\n");

rl.addListener("line", (input) => {
  if (input === "exit") {
    rl.write("Have a nice day!");
    process.exit(0);
  }
  stream.write(input + "\n");
});

rl.addListener("close", () => {
  rl.write("Have a nice day!");
  process.exit(0);
});

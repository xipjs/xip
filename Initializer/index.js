#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { template } = require("./template");

let name = process.argv[2];

async function SetName() {
  if (name !== ".") {
    if (!name) {
      name = "XipApp";
    }
    await fs.promises.mkdir(name);
  }
}

async function WriteTemplate(template, dir) {
  for (var i = 0; i < template.Dirs.length; i++) {
    await fs.promises.mkdir(path.join(dir, template.Dirs[i]));
  }
  let keys = Object.keys(template.Files);
  for (var i = 0; i < keys.length; i++) {
    await fs.promises.writeFile(
      path.join(dir, keys[i]),
      template.Files[keys[i]]
    );
  }
}

SetName().then(() =>
  WriteTemplate(template, name).then(() => {
    console.log(
      "Template created at " +
        `"` +
        name +
        `"` +
        ",\nStart the project with the following commands:"
    );
    name !== "." && console.log("> cd " + name);
    console.log("> npm install");
    console.log("> npm run dev");
  })
);

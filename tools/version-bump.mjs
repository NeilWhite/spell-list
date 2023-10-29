import { readFileSync, writeFileSync } from "fs";

// eslint-disable-next-line no-undef
const targetVersion = process.env.npm_package_version;

const updateFile = (fileName, update) => {
  let file = JSON.parse(readFileSync(fileName, "utf8"));
  update(file);
  writeFileSync(fileName, JSON.stringify(file, null, 2));
};

updateFile("module.json", u => {
  u.version = targetVersion;
  u.download = `https://github.com/neilwhite/spell-list/releases/download/v${targetVersion}/spell-list.zip`;
});

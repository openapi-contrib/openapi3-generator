const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const Handlebars = require('handlebars');

const getFileContent = filePath => {
  return fs.readFileSync(filePath, 'utf8');
};

module.exports = async filePath => {
  let extname = path.extname(filePath);
  // rm 2 extensions if the last is .hbs e.g. .md.hbs
  if (extname === ".hbs") {
    const filePathSansExt = filePath.replace(extname, "");
    extname = path.extname(filePathSansExt) + extname;
  }
  const partialName = _.camelCase(path.basename(filePath, extname));
  Handlebars.registerPartial(partialName, getFileContent(filePath));
};

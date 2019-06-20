const path = require('path');
const fs = require('fs');
const jstransformer = require('jstransformer');
const ignore = require('ignore');
const BOOTSTRAP_FILENAME = '.bootstrap.js';

let bootstrap = {
  // default template engine
  jstransformer: 'handlebars',
  // file to ignore when dumping/rendering
  ignore: [],
  // options to pass to template engine
  options: {},
  // extension (regex) that will be removed from filename
  extension: '.hbs'
};

module.exports = {
  init: (directory) => {
    const bootstrapFilename = path.resolve(directory, BOOTSTRAP_FILENAME);
    if (fs.existsSync(bootstrapFilename)) {
      bootstrap = Object.assign(bootstrap, require(bootstrapFilename));
    }

    return this;
  },

  render: (str, locals) => {
    const engine = jstransformer(require(`jstransformer-${bootstrap.jstransformer}`));

    return engine.render(str, bootstrap.options, locals).body;
  },

  ignores: (filepath) => {
    const ig = ignore().add(bootstrap.ignore).add(BOOTSTRAP_FILENAME);

    return ig.ignores(filepath);
  },

  resolve: (filepath) => {
    const regexp = new RegExp(`${bootstrap.extension}$`);

    return filepath.replace(regexp, '');
  }
};

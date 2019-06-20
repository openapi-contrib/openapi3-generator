const path = require('path')
  fs = require('fs')
  jstransformer = require('jstransformer')
  ignore = require('ignore')
  BOOTSTRAP_FILENAME = '.bootstrap.js';
;

var bootstrap = {
  //default template engine
  jstransformer: 'handlebars',
  //file to ignore when dumping/rendering
  ignore: [],
  //options to pass to template engine
  options: {},
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
    engine = jstransformer(require('jstransformer-' + bootstrap.jstransformer));

    return engine.render(str, bootstrap.options, locals).body;
  },

  ignores: (filepath) => {
    const ig = ignore().add(bootstrap.ignore).add(BOOTSTRAP_FILENAME);

    return ig.ignores(filepath);
  }
};

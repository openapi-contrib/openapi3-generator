const path = require('path');
const fs = require('fs');
const _ = require('lodash');

/**
 * Register every file *.hbs in {directory} as a handlebars partial
 *
 * @param {string} directory
 */
const registerPartial = directory => {
  if (!fs.existsSync(directory)) return {};

  const filenames = fs.readdirSync(directory);

  const partials = {};
  filenames.forEach((filename) => {
    const matches = (/^([^.]+)(.*)?.hbs$/).exec(filename);
    if (!matches) {
      return;
    }
    const name = _.camelCase(matches[1]);

    const template = fs.readFileSync(path.join(directory, filename), 'utf8');

    partials[name] = template;
  });

  return partials;
};

/**
 * Array of handlebards helpers
 */
const helpers = {
  acceptedValues: items => {
    if (!items) return '<em>Any</em>';

    return items.map(i => `<code>${i}</code>`).join(', ');
  },
  buildPath: (propName, path) => {
    if (!path) return propName;
    return `${path}.${propName}`;
  },
  equal: (lvalue, rvalue, options) => {
    if (arguments.length < 3)
      throw new Error('Handlebars Helper equal needs 2 parameters');
    if (lvalue !== rvalue) {
      return options.inverse(this);
    }

    return options.fn(this);
  },
  isRequired: (obj, key) => {
    if (!obj || !obj.required) return false;
    return !!(obj.required.includes(key));
  },
  stringify: json => {
    try {
      return JSON.stringify(json || '', null, 2);
    } catch (e) {
      return '';
    }
  },
  tree: path => {
    if (!path) return '';
    const filteredPaths = path.split('.').filter(Boolean);
    if (!filteredPaths.length) return;
    const dottedPath = filteredPaths.join('.');

    return `${dottedPath}.`;
  },
  uppercase: (str) => {
    return str.toUpperCase();
  },
  validMethod: (method, options) => {
    const authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

    if (arguments.length < 3)
      throw new Error('Handlebars Helper validMethod needs 1 parameter');
    if (authorized_methods.indexOf(method.toUpperCase()) === -1) {
      return options.inverse(this);
    }

    return options.fn(this);
  }
};

module.exports = {
  jstransformer: 'handlebars',
  ignore: [
    '.partials'
  ],
  options: {
    helpers,
    partials: registerPartial(path.join(__dirname, '.partials'))
  }
};

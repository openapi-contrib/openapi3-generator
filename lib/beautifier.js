const OpenAPISampler = require('openapi-sampler');
const _ = require('lodash');
const slugg = require('slugg');
const md = require('markdown-it')();
const curlGenerator = require('./curl-builder');

const sharedStart = (array) => {
  if (array.length == 0) { return ''; }
  const A = array.concat().sort();
  const a1 = A[0], a2 = A[A.length - 1], L = a1.length;
  let i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
};

const resolveAllOf = (schema) => {
  if (schema.allOf) {
    const schemas = [];
    schema.allOf.forEach((s) => {
      schemas.push(s);
    });

    return resolveAllOf(_.merge(...schemas));
  }

  if (schema.properties) {
    const transformed = {};

    for (const key in schema.properties) {
      if (schema.properties[key].allOf) {
        transformed[key] = resolveAllOf(schema.properties[key]);
        continue;
      }
      transformed[key] = schema.properties[key];
    }

    schema.properties = transformed;

    return schema;
  }

  return schema;
};

const generateExample = schema => OpenAPISampler.sample(schema);

const mdToHTML = (text) => {
  const finalText = text || '';
  if (finalText.match(/\n/)) return md.render(finalText);
  return md.renderInline(finalText);
};

const beautifySchema = (schema) => {
  resolveAllOf(schema);
  schema.summaryAsHTML = mdToHTML(schema.summary);
  schema.descriptionAsHTML = mdToHTML(schema.description);

  if (schema.title) schema.slug = `schema-${slugg(schema.title)}`;
  if (!schema.example) schema.generatedExample = generateExample(schema);

  _.each(schema.properties, beautifySchema);
  _.each(schema.additionalProperties, beautifySchema);
  if (schema.items) beautifySchema(schema.items);

  return schema;
};

const beautifyOperation = (operation, operationName, pathName, options) => {
  operation.slug = slugg(`op-${operationName}-${pathName}`);
  operation.summaryAsHTML = mdToHTML(operation.summary);
  operation.descriptionAsHTML = mdToHTML(operation.description);

  if (operation.requestBody) {
    _.each(operation.requestBody.content, (contentType) => {
      if (contentType.schema) {
        contentType.schema = beautifySchema(contentType.schema);
      }
    });
  }

  if (operation.parameters) {
    operation.parameters = operation.parameters.filter(p => p.in !== 'body');
    operation.parameters.filter(p => p.schema).forEach(param => resolveAllOf(param.schema));

    operation.parameters.forEach((param) => {
      param.descriptionAsHTML = mdToHTML(param.description);
      if (param.schema) beautifySchema(param.schema);
    });

    operation.headers = operation.parameters.filter(p => p.in === 'header');
    operation.queryParams = operation.parameters.filter(p => p.in === 'query');
    operation.pathParams = operation.parameters.filter(p => p.in === 'path');
    operation.cookieParams = operation.parameters.filter(p => p.in === 'cookie');

  }
  if (options.curl) {
    operation.curl = curlGenerator(operation, operationName, pathName);
  }

  if (operation.responses) {
    _.each(operation.responses, (response) => {
      if (response.content) {
        _.each(response.content, (contentType) => {
          beautifySchema(contentType.schema);
        });
      }
      if (response.headers) {
        _.each(response.headers, (contentType) => {
          beautifySchema(contentType.schema);
        });
      }
    });
  }

  return operation;
};

const cleanBrackets = text => {
  let finalText = text;

  if (text.startsWith('{')) finalText = finalText.substr(1);
  if (text.endsWith('}')) finalText = finalText.slice(0, -1);

  return finalText;
};

module.exports = (openapi, config) => {
  openapi.basePath = openapi.basePath || '';
  openapi.info = openapi.info || {};
  openapi.info.descriptionAsHTML = mdToHTML(openapi.info.description);

  if (!openapi.components) openapi.components = {};
  if (!openapi.components.schemas) {
    openapi.__noSchemas = true;
    openapi.components.schemas = {};
  }

  _.each(openapi.components.schemas, beautifySchema);

  if (openapi.servers) {
    _.each(openapi.servers, server => {
      server.descriptionAsHTML = mdToHTML(server.description);
      _.each(server.variables, variable => {
        variable.descriptionAsHTML = mdToHTML(variable.description);
      });
    });
  }

  if (openapi.security) {
    openapi._security = [];

    _.each(openapi.security, security => {
      const name = Object.keys(security)[0];
      if (!openapi.components || !openapi.components.securitySchemes || !openapi.components.securitySchemes[name]) {
        throw new Error(`Security definition "${name}" is not in included in #/components/securitySchemes.`);
      }

      openapi.components.securitySchemes[name].descriptionAsHTML = mdToHTML(openapi.components.securitySchemes[name].description);
      openapi._security.push(openapi.components.securitySchemes[name]);
    });
  }

  _.each(openapi.paths, (path, pathName) => {
    path.endpointName = pathName === '/' ? 'root' : cleanBrackets(pathName.split('/')[1]);

    const basePath = openapi.basePath.trim();

    const newPathName = basePath.length ? `${basePath}/${pathName}` : pathName;
    if (newPathName !== pathName) {
      openapi.paths[newPathName] = path;
      delete openapi.paths[pathName];
    }

    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

    _.each(path, (operation, operationName) => {
      if (httpMethods.includes(operationName.toUpperCase())) beautifyOperation(operation, operationName, pathName, config);
    });
  });

  openapi.endpoints = _.uniq(_.map(openapi.paths, 'endpointName'));

  const commonPrefix = sharedStart(Object.keys(openapi.paths));
  const levels = commonPrefix.split('/').length - 1;
  openapi.__commonPrefix = commonPrefix.split('/').slice(0, levels).join('/');

  return openapi;
};

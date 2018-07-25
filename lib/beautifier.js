const OpenAPISampler = require('openapi-sampler');
const _ = require('lodash');
const md = require('markdown-it')();

const sharedStart = (array) => {
  const A = array.concat().sort();
  const a1 = A[0], a2= A[A.length-1], L= a1.length;
  let i = 0;
  while (i<L && a1.charAt(i)=== a2.charAt(i)) i++;
  return a1.substring(0, i);
};

const resolveAllOf = (schema) => {
  if (schema.allOf) {
    const schemas = [];
    schema.allOf.forEach((s) => {
      schemas.push(s);
    });

    return resolveAllOf(_.merge({}, ...schemas));
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

    return {
      ...schema,
      ...{ properties: transformed }
    };
  }

  return schema;
};

const stringify = json => JSON.stringify(json || '', null, 2);
const generateExample = schema => OpenAPISampler.sample(schema);

const beautifyOperation = (operation) => {
  operation.summaryAsHTML = md.render(operation.summary || '');
  operation.descriptionAsHTML = md.render(operation.description || '');

  if (operation.parameters) {
    operation.parameters.filter(p => p.schema).forEach(param => resolveAllOf(param.schema));

    if (operation.requestBody) {
      operation.parameters = operation.parameters.filter(p => p.in !== 'body');
    }

    operation.parameters.forEach((param, index) => {
      param.descriptionAsHTML = md.render(param.description || '');
    });
  }

  if (operation.responses) {
    _.each(operation.responses, (response, responseCode) => {
      if (response.content && response.content.schema) {
        resolveAllOf(response.content.schema);
      }
      if (response.headers && response.headers.schema) {
        resolveAllOf(response.headers.schema);
      }
    });
  }

  return operation;
};

const beautifySchema = (schema) => {
  _.each(schema.properties, (prop, propName) => {
    if (prop.description) prop.descriptionAsHTML = md.render(prop.description || '');
    if (prop.properties) beautifySchema(prop);
  });
  _.each(schema.additionalProperties, (prop, propName) => {
    if (prop.description) prop.descriptionAsHTML = md.render(prop.description || '');
    if (prop.additionalProperties) beautifySchema(prop);
  });
};

const cleanBrackets = text => {
  let finalText = text;

  if (text.startsWith('{')) finalText = finalText.substr(1);
  if (text.endsWith('}')) finalText = finalText.slice(0, -1);

  return finalText;
};

module.exports = (openapi) => {
  openapi.basePath = openapi.basePath || '';
  openapi.info = openapi.info || {};
  openapi.info.descriptionAsHTML = md.render(openapi.info.description || '');

  if (openapi.servers) {
    _.each(openapi.servers, server => {
      server.descriptionAsHTML = md.render(server.description || '');
      _.each(server.variables, variable => {
        variable.descriptionAsHTML = md.render(variable.description || '');
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

      openapi.components.securitySchemes[name].descriptionAsHTML = md.render(openapi.components.securitySchemes[name].description || '');
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
      if (httpMethods.includes(operationName.toUpperCase())) beautifyOperation(operation);
    });
  });

  openapi.endpoints = _.unique(_.pluck(openapi.paths, 'endpointName'));

  if (!openapi.components) openapi.components = {};
  if (!openapi.components.schemas) {
    openapi.__noSchemas = true;
    openapi.components.schemas = {};
  }

  _.each(openapi.components.schemas, (schema, schemaName) => {
    schema = resolveAllOf(schema);
    if (schema.example) {
      schema.formattedExample = stringify(schema.example);
    } else {
      schema.generatedExample = stringify(generateExample(schema));
    }
    openapi.components.schemas[schemaName] = schema;
    beautifySchema(schema);
  });

  const commonPrefix = sharedStart(Object.keys(openapi.paths));
  const levels = commonPrefix.split('/').length - 1;
  openapi.__commonPrefix = commonPrefix.split('/').slice(0, levels).join('/');

  return openapi;
};

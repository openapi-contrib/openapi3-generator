const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');
const validator = require('oas-validator');

const handleHTTPResponse = (url, res, resolve, reject) => {
  if (res.statusCode >= 400) return reject(`Can't get file ${url}`);

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => { resolve(rawData); });
  res.on('error', reject);
};

function getContentFromURL (url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('http:')) {
      http.get(url, (res) => {
        handleHTTPResponse(url, res, resolve, reject);
      }).on('error', reject);
    } else if (url.startsWith('https:')) {
      https.get(url, (res) => {
        handleHTTPResponse(url, res, resolve, reject);
      }).on('error', reject);
    } else {
      reject('Protocol not supported.');
    }
  });
}

function getFileContent (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), (err, content) => {
      if (err) {
        getContentFromURL(filePath)
          .catch(reject)
          .then(content => resolve(content));
        return;
      }
      resolve(content);
    });
  });
}

function parseContent (content) {
  content = content.toString('utf8');
  try {
    return JSON.parse(content);
  } catch (e) {
    return YAML.safeLoad(content);
  }
}

async function dereference (json) {
  return RefParser.dereference(json, {
    dereference: {
      circular: 'ignore'
    }
  });
}

async function bundle (json) {
  return RefParser.bundle(json, {
    dereference: {
      circular: 'ignore'
    }
  });
}

async function bundler (filePath) {
  let content, parsedContent, dereferencedJSON, bundledJSON;

  try {
    content = await getFileContent(filePath);
  } catch (e) {
    console.error('Can not load the content of the Swagger specification file');
    console.error(e);
    return;
  }

  try {
    parsedContent = parseContent(content);
  } catch (e) {
    console.error('Can not parse the content of the Swagger specification file');
    console.error(e);
    return;
  }

  try {
    dereferencedJSON = await dereference(parsedContent);
  } catch (e) {
    console.error('Can not dereference the JSON obtained from the content of the Swagger specification file');
    console.error(e);
    return;
  }

  try {
    bundledJSON = await bundle(dereferencedJSON);
  } catch (e) {
    console.error('Can not bundle the JSON obtained from the content of the Swagger specification file');
    console.error(e);
    return;
  }

  try {
    validator.validateSync(bundledJSON, {});
  } catch (e) {
    console.error('Invalid OpenAPI file');
    console.error(e);
    return;
  }

  return JSON.parse(JSON.stringify(bundledJSON));
}

module.exports = bundler;

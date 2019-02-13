const CONTENT_TYPE_HEADER = "Content-Type";

const curlBuilder = (operation, operationName, pathName) => {
  if (operation.requestBody && operation.requestBody.content) {
    return Object.keys(operation.requestBody.content).map((content) =>
      generateBodyBashPerContentType(operation, operationName, pathName, content,
        operation.requestBody.content[content].schema.generatedExample || operation.requestBody.content[content].schema.example)
    ).join("\n");
  }
  return generateBodyCurl(operation, operationName, pathName);
};

function generateBodyCurl(operation, operationName, pathName) {

  let curlBuilder = new CurlBuilder(operationName, pathName, operation.pathParams);

  if (operation.headers) {
    curlBuilder = curlBuilder.withHeaders(operation.headers)
  }

  return curlBuilder.build();
}

function generateBodyBashPerContentType(operation, operationName, pathName, contentType, requestBody) {

  let curlBuilder = new CurlBuilder(operationName, pathName, operation.pathParams, operation.queryParams)
    .withContentTypeCurlHeader(contentType)
    .withContentTypeHeader(contentType)
    .withRequestBody(requestBody);
  if (operation.headers) {
    curlBuilder = curlBuilder.withHeaders(operation.headers)
  }

  return curlBuilder.build();

}

class CurlBuilder {
  constructor(operationName, pathName, pathParams, queryParams) {
    let query = "";
    if (queryParams) {
      query = "?" + queryParams
        .map(queryParam => `${queryParam.name}=${queryParam.example || queryParam.name}`)
        .join("&");
    }
    if (pathParams) {
      pathParams.forEach(pathParams => {
        pathName = pathName.replace(`{${pathParams.name}}`, pathParams.example || pathParams.name)
      })
    }
    this.headers = [];
    this.body = "";
    this.curl = `curl -X "${operationName.toUpperCase()}" "${pathName}" \\`;
  }

  withContentTypeCurlHeader(contentType) {
    this.curl = `# ${contentType} \n` + this.curl;
    return this;
  }

  withContentTypeHeader(contentType) {
    this.headers.push(`-H '${CONTENT_TYPE_HEADER}: ${contentType}' \\`);
    return this;
  }

  withHeaders(headers) {
    this.headers.push(...headers
      .map(header => `-H '${header.name}: ${header.example || header.name}' \\`));
    return this;
  }

  withRequestBody(requestBody) {
    this.body += `-d $'{${JSON.stringify(requestBody)}} \\`;
    return this;
  }

  build() {
    let curlScript = this.curl;
    if (this.headers.length !== 0) {
      curlScript += "\n" + this.headers.join("\n")
    }
    if (this.body.length !== 0) {
      curlScript += "\n" + this.body;
    }
    return curlScript.substr(0, curlScript.length - 1)
  }

}

module.exports = curlBuilder;

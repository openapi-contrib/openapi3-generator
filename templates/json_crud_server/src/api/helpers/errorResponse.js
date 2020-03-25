class ErrorResponse {
      constructor(
        errorCode,
        title,
        instance,
        status,
        detail
    ) {
      this.errorCode= errorCode;
      this.title= title;
      this.instance= instance;
      this.status= status;
      this.detail= detail;
      }
}

ErrorResponse.prototype.toString = function ErrorResponseToString() {
  return '{' +
    this.errorCode + " | " +
    this.title + " | " +
    this.instance + " | " +
    this.status + " | " +
    this.detail + '}'
}
module.exports = {
  ErrorResponse
};

const binaryMimeTypes = [
  "application/octet-stream",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];

module.exports.handler = function(event: any, context: any, callback: any) {
  var responseData = { serverTime: Date(), otherData: "Goodbye WORLD" };
  var response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(responseData),
  };
  callback(null, response);
};

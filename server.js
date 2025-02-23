const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Test");
});

server.listen(process.env.PORT || 3000);

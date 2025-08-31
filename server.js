const http = require("http");
const { handleRequest } = require("./controller");

const PORT = 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Sever running at http://localhost:${PORT}`);
});



//main
const net = require("net");

console.log("Initiated");

const server = net.createServer((connection) => {
  connection.write("Client connected to server\r\n");

  connection.on("data", (data) => {
    const message = data.toString().trim();
    console.log("message: ", message);

    if (message.includes("PING")) {
      connection.write("+PONG\r\n");
    }
  });

  connection.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(6379, "127.0.0.1", () => {
  console.log("Tedis server is listening on port 6379");
});

//main
const net = require("net");
const Parser = require("redis-parser");
console.log("Initiated");

const server = net.createServer((connection) => {
  connection.on("data", (data) => {
    const Message = new Parser({
      returnReply: (reply) => {
        console.log(reply);
        const command = reply[0];
        console.log(command);
        switch (command) {
          case "ping":
            {
              connection.write("+PONG\r\n");
            }
            break;
          case "echo": {
            const message = reply[1];

            connection.write(`$${message.length}\r\n${message}\r\n`);
          }
        }
      },
      returnError: (err) => {
        console.log("=>", err);
      },
    });
    Message.execute(data);
  });

  connection.on("end", () => {
    console.log("Client disconnected");
  });
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Tedis server is listening on port 8000");
});

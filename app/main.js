//main
const net = require("net");
const Parser = require("redis-parser");
const echoFunction = require("./utils");
console.log("Initiated");

const server = net.createServer((connection) => {
  connection.on("data", (data) => {
    const Message = new Parser({
      returnReply: (reply) => {
        console.log(reply);
        const command = reply[0].toLowerCase();
        console.log(command);
        switch (command) {
          //ping command
          case "ping":
            {
              connection.write("+PONG\r\n");
            }
            break;
          //echo command
          case "echo": {
            const message = echoFunction(reply);
            connection.write(message);
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

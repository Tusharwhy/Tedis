//following function returns echo command
function echoFunction(arr) {
  let message = arr.filter((idx) => idx !== "echo").join(" ");
  if (!message) {
    return "$0\r\n\r\n";
  }
  let resp = `$${message.length}\r\n${message}\r\n`;
  return resp;
}

module.exports = echoFunction;

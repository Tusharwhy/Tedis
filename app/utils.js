//following function returns echo command
function echoFunction(arr) {
  let message = arr.filter((idx) => idx.toLowerCase() !== "echo").join(" ");
  if (!message) {
    return "$0\r\n\r\n";
  }
  let resp = `$${message.length}\r\n${message}\r\n`;
  return resp;
}

let store = {};
function setKeyValue(arr) {
  let data = arr.filter((idx) => {
    return idx.toLowerCase() !== "set";
  });
  let someKey = data[0];
  let someValue = data[1];
  store[someKey] = someValue;

  return `+OK\r\n`;
}

function getKeyValue(arr) {
  let data = arr.filter((idx) => {
    return idx.toLowerCase() !== "get";
  });
  let someKey = data[0];
  if (!someKey) return "provide key";
  let value = store[someKey];
  console.log(value);
  if (!value) return "$-1\r\n";
  let RESP = `$${value.length}\r\n${value}\r\n`;
  return RESP;
}

module.exports = { echoFunction, setKeyValue, getKeyValue };

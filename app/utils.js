//following function returns echo command
function echoFunction(arr) {
  let message = arr.filter((idx) => idx.toLowerCase() !== "echo").join(" ");
  if (!message) {
    return "$0\r\n\r\n";
  }
  let resp = `$${message.length}\r\n${message}\r\n`;
  return resp;
}

// we create in memory store for storing key value pair
let store = {};

/* 
 - ["SET", "key", "value", "EX", 5000]
 - we create a function for setting values.
 - it accepts an array which has SET command, "KEY", "VALUE", PX/EX(optional), "expiryTime".
 - We store the key and value with expiry time. and using setTimeout we delete the key value once it expires.
 - PX - when we recieve timer in milliseconds
 - EX - when we recieve timer in seconds
*/
function setKeyValue(arr) {
  let data = arr.filter((idx) => idx.toLowerCase() !== "set");

  // Extracting key and value from array
  let someKey = data[0];
  let someValue = data[1];

  // Function is responsible for deleting key value pairs on expiry time
  const handleExpiry = (expiryTime, isMilliseconds) => {
    store[someKey] = { value: someValue, expiresAt: Date.now() + expiryTime };

    setTimeout(
      () => {
        delete store[someKey];
      },
      isMilliseconds ? expiryTime : expiryTime * 1000
    );
  };

  // if PX flag
  if (data[2]?.toLowerCase() === "px") {
    if (data[3] === undefined) {
      return `$${"Provide expiry time".length}\r\nProvide expiry time\r\n`;
    }
    let expiryTime = Number(data[3]);
    handleExpiry(expiryTime, true);
  }
  // if EX flag
  else if (data[2]?.toLowerCase() === "ex") {
    if (data[3] === undefined) {
      return `$${"Provide expiry time".length}\r\nProvide expiry time\r\n`;
    }

    let expiryTime = Number(data[3]);
    handleExpiry(expiryTime, false);
  }
  // without any flags
  else {
    store[someKey] = { value: someValue, expiresAt: null };
  }
  return `+OK\r\n`;
}

/* 
  -  This function is responsible to GET value from our STORE.
  -  Before providing value we check if it exists in our store.
  -  We also chech whether its expired or not.
  -  we delete the value if it is expired.
  -  Returning "nil" if we don't find any key or if its expired.
*/
function getKeyValue(arr) {
  let data = arr.filter((idx) => idx.toLowerCase() !== "get");
  let someKey = data[0];
  if (!someKey) return "provide key";

  let value = store[someKey];
  console.log(value, "this is value");
  console.log(store);
  // Check if the key exists
  if (!value) return "$-1\r\n";

  // Check for expiration
  if (value.expiresAt && Date.now() > value.expiresAt) {
    delete store[someKey]; // Remove the expired key
    return "$-1\r\n"; // Return null bulk string
  }

  // If the key is valid and not expired
  let RESP = `$${value.value.length}\r\n${value.value}\r\n`;
  return RESP;
}

module.exports = { echoFunction, setKeyValue, getKeyValue };

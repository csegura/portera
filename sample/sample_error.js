const portera = require("../lib/portera");
const debug = {};

portera({
  obj: debug,
  use: process.env.NODE_ENV === "production" ? [] : null,
});

debug.info(process.env.NODE_ENV);

function forcedError() {
  try {
    return debug.count();
  } catch (err) {
    debug.error(err);
    throw new Error("forcedError: " + err.message);
  }
}

try {
  var result = forcedError();
  debug.log("Result:", result);
} catch (err) {
  debug.log(err);
  debug.error(err);
}

debug.dump(this);
debug.dump(process);

setTimeout(() => process.exit(), 2000);

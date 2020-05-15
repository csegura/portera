const portera = require("../lib/portera");
const debug = {};
portera({
  obj: debug,
  nouse: ["log", "info"],
});

debug.dump(console);
debug.dump(process);
debug.dump(debug);

var util = require("util");
console.log(util.inspect(console));

debug.log("hello!!");
debug.info("hello!!");

setTimeout(() => process.exit(), 2000);

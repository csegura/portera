const portera = require("../lib/portera");
const debug = {};
portera({
  host: "http://localhost:3001",
  obj: debug,
});

const o = {
  a: "test",
  b: "test2",
  c: 123,
};

try {
  throw new Error("Super Error");
} catch (err) {
  debug.error(err);
}

debug.assert(o.a === "sample", "o.a not is sample", o);
debug.trace();
debug.log(o);

setTimeout(() => {
  debug.log(process.platform);
  debug.log(1234);
  debug.info("sample", __dirname);
  debug.log("object", o, o);
  debug.info(process.getuid);
  debug.warn(1, 2, 3, 4);
  debug.trace("Trace");
}, 2000);

debug.log("exit");
console.log("exit");
setTimeout(() => process.exit(), 10000);

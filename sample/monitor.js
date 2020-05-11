const portera = require("../lib/portera");
const debug = {};
portera({
  host: "http://localhost:3001", 
  obj: debug,
  performance: 1000
});

setInterval(() => {
  var time = process.hrtime();
  setImmediate(() => {
    var delta = process.hrtime(time);
    debug.info("delta",delta);
  });
},500);

setInterval(() => {
  debug.info(process.memoryUsage());
  debug.info(process.cpuUsage());
},1000);

setTimeout(() => {
  process.exit();
},20000);
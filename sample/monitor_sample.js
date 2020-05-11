const Portera = require("../lib/portera");
const debug = {};

Portera({
  host: "http://localhost:3001",
  obj: debug,
  performance: 2000,
});

// setInterval(() => {
//   var time = process.hrtime();
//   var cpud = process.cpuUsage();
//   setImmediate(() => {
//     var del = process.hrtime(time);
//     var dcpu = process.cpuUsage(cpud);
//     debug.info("delta", del);
//     debug.info("cpu delta", cpud);
//     debug.info("cpu delta", process.cpuUsage());
//   });
// }, 2000);
// setInterval(() => {
//   debug.info(process.memoryUsage());
//   debug.info(process.cpuUsage());
// }, 1000);

// intensive memory each 10s
setInterval(() => {
  let s = "";
  for(let i=0; i<1000000; i++){
      s = s + "X";
  }
}, 10000);

// intensive calc each 15s
setInterval(() => {
  let result = 0;	
	for (var i = Math.pow(10, 7); i >= 0; i--) {		
		result += Math.atan(i) * Math.tan(i);
	};
}, 25000);

setTimeout(() => {
  process.exit();
}, 200000);

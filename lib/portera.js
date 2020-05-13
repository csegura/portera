const io = require("socket.io-client");
const Tools = require("./tools");

const portera = (cfg) => {
  var socket;
  cfg = cfg || {};

  const setup = () => {
    socket = io(cfg.host);

    function log_msg(kind, args) {
      return {
        kind: kind,
        time: Number(Date.now()),
        args: args,
      };
    }

    // replace basic
    ["log", "info", "warn", "error"].forEach((e) => {
      cfg.obj[e] = (...args) => {
        socket.emit("log", log_msg(e, args));
      };
    });

    cfg.obj["error"] = (...args) => {
      args.map((e) => {
        console.log(typeof e);
        if (e && e.hasOwnProperty("stack") && typeof e.stack === "string") {
          e.stack = "[tr]" + e.stack;
        }
      });

      socket.emit("log", log_msg("error", args));
    };

    cfg.obj["trace"] = (args) => {
      const err = new Error();
      err.name = "Trace";
      socket.emit("log", log_msg("trace", [args, { trace: "[tr]" + err.stack }]));
    };

    cfg.obj["logobj"] = (...args) => {
      let sargs = args.map((e) => {
        if (typeof e === "object") {
          return JSON.parse(Tools.sringfyObj(e));
        }
        return e;
      });
      socket.emit("log", log_msg("logobj", sargs));
    };

    // TODO: complete
    // https://v8.dev/docs/stack-trace-api
    // better traces
    cfg.obj["btrace"] = (...args) => {
      const getStack = () => {
        var v8o = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
          return stack;
        };
        var err = new Error();
        Error.captureStackTrace(err);
        var stack = err.stack;
        Error.prepareStackTrace = v8o;
        return stack;
      };
      let stack = [];
      getStack().forEach((e) => {
        stack.push({
          typeName: e.getTypeName(),
          functionName: e.getFunctionName() || "anonymous",
          methodName: e.getMethodName(),
          fileName: e.getFileName(),
          lineNumber: e.getLineNumber(),
          evalOrigin: e.getEvalOrigin(),
          isToplevel: e.isToplevel(),
          isEval: e.isEval(),
          isConstructor: e.isConstructor(),
          isAsync: e.isAsync(),
          isPromiseAll: e.isPromiseAll(),
          promiseIndex: e.getPromiseIndex(),
        });
      });
      socket.emit("log", log_msg("btrace", [params, stack]));
    };

    cfg.obj["assert"] = (expression, ...args) => {
      if (!expression) {
        args[0] = `assertion failed${args.length === 0 ? "" : `: ${args[0]}`}`;
        socket.emit("log", log_msg("assert", args));
      }
    };

    cfg.obj["stack"] = function stackIn() {
      function trace(fn) {
        if (fn && fn.name) {
          var args = [...fn.arguments];
          return trace(fn.caller) + fn.name + "(" + args.join(", ") + ")" + "\n";
        }
        return "";
      }
      socket.emit("log", log_msg("stack", [trace(stackIn.caller)]));
    };

    if (cfg.performance) {
      performance(cfg.performance);
    }
  };

  const performance = (ms) => {
    function perf_msg(el, cpu) {
      return {
        cpu: cpu,
        mem: process.memoryUsage(),
        el: el,
        time: Number(Date.now()),
      };
    }
    setInterval(() => {
      var ctime = process.hrtime();
      var ccpu = process.cpuUsage();
      setImmediate(() => {
        var el = process.hrtime(ctime);
        var cpu = process.cpuUsage(ccpu);
        socket.emit("perf", perf_msg(el, cpu));
      });
    }, ms);
  };

  Tools.stringfyErrorJson();

  try {
    cfg.host = cfg.host || "http://localhost:3001";
    cfg.obj = cfg.obj || console;
    cfg.performance = cfg.performance || 0;
    setup();
  } catch {
    throw new Error("portera setup error");
  }
};

module.exports = portera;

const io = require("socket.io-client");

const portera = (cfg) => {
  var socket;
  cfg = cfg || {};
  
  try {
    cfg.host = cfg.host || "localhost:3001";
    cfg.obj = cfg.obj || console;
    cfg.performance = cfg.performance || 0;
  } catch {
    throw new Error("invalid portera conugration");
  }

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

    cfg.obj["trace"] = (args) => {
      const err = new Error();
      err.name = "Trace";
      socket.emit("log", log_msg("trace", [args, err]));
    };

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
        } else {
          return "";
        }
      }
      socket.emit("log", log_msg("stack", [trace(stackIn.caller)]));
    };

    if (cfg.performance) {
      performance(cfg.performance);
    }

  };

  const performance = (ms) => {
    function perf_msg(el,cpu) {
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
        socket.emit("perf",perf_msg(el,cpu));
      });
    },ms);
  };

  setup();

};

module.exports = portera;

// strinfy errors

if (!("toJSON" in Error.prototype))
  Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
      var alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });

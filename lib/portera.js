const io = require("socket.io-client");
const Tools = require("./tools");

const portera = cfg => {
  var socket;
  var group = "portera";

  const log_msg = (kind, args) => {
    return {
      kind: kind,
      group: group,
      time: Number(Date.now()),
      args: args,
    };
  };

  const portera_log = (...args) => {
    socket.emit("log", log_msg("log", args));
  };

  const portera_info = (...args) => {
    socket.emit("log", log_msg("info", args));
  };

  const portera_warn = (...args) => {
    socket.emit("log", log_msg("warn", args));
  };

  const portera_error = (...args) => {
    args.map(e => {
      if (e && e.hasOwnProperty("stack") && typeof e.stack === "string") {
        e.stack = "[tr]" + e.stack;
      }
    });
    socket.emit("log", log_msg("error", args));
  };

  const portera_trace = args => {
    const err = new Error();
    err.name = "Trace";
    socket.emit("log", log_msg("trace", [args, { trace: "[tr]" + err.stack }]));
  };

  const portera_dir = (...args) => {
    let sargs = args.map(e => {
      if (typeof e === "object") {
        return JSON.parse(Tools.sringfyObj(e));
      }
      return e;
    });
    socket.emit("log", log_msg("dir", sargs));
  };

  // TODO: complete
  // https://v8.dev/docs/stack-trace-api
  // better traces
  const portera_btrace = (...args) => {
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
    getStack().forEach(e => {
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
    socket.emit("log", log_msg("btrace", stack));
  };

  const portera_assert = (expression, ...args) => {
    if (!expression) {
      args[0] = `assertion failed${args.length === 0 ? "" : `: ${args[0]}`}`;
      socket.emit("log", log_msg("assert", args));
    }
  };

  const portera_stack = function stackIn() {
    var indent = 0;
    function trace(fn) {
      indent = indent + 1;
      if (fn && fn.name) {
        var args = [...fn.arguments];
        return (
          trace(fn.caller) +
          " ".padStart(indent, " ") +
          fn.name +
          "(" +
          args.join(", ") +
          ")|"
        );
      }
      return "";
    }
    const stack = trace(stackIn.caller);
    socket.emit("log", log_msg("stack", stack.split("|")));
  };

  const portera_group = name => {
    if (name) {
      group = name;
    } else {
      group = "portera";
    }
  };

  const performance = ms => {
    function perf_msg(el) {
      return {
        cpu: process.cpuUsage(),
        mem: process.memoryUsage(),
        el: el,
        time: Number(Date.now()),
      };
    }
    setInterval(() => {
      var ctime = process.hrtime();
      setImmediate(() => {
        var el = process.hrtime(ctime);
        socket.emit("perf", perf_msg(el));
      });
    }, ms);
  };

  const setup = () => {
    socket = io(cfg.host);

    cfg.use.forEach(e => {
      var fnc = portera_fncs.find(f => f.name == e);
      if (fnc) cfg.obj[e] = fnc.fnc;
    });

    cfg.nouse.forEach(e => {
      var fnc = portera_fncs.find(f => f.name == e);
      if (fnc) cfg.obj[e] = () => {};
    });

    cfg.obj["group"] = portera_group;

    if (cfg.performance) {
      performance(cfg.performance);
    }
  };

  const portera_close = () => {
    socket.close();
  };

  cfg = cfg || {};

  const portera_fncs = [
    { name: "log", fnc: portera_log },
    { name: "info", fnc: portera_info },
    { name: "warn", fnc: portera_warn },
    { name: "error", fnc: portera_error },
    { name: "assert", fnc: portera_assert },
    { name: "trace", fnc: portera_trace },
    { name: "btrace", fnc: portera_btrace },
    { name: "stack", fnc: portera_stack },
    { name: "dir", fnc: portera_dir },
    { name: "close", fnc: portera_close },
  ];

  try {
    cfg.host = cfg.host || "http://localhost:3001";
    cfg.obj = cfg.obj || console;
    cfg.performance = cfg.performance || 0;
    cfg.use = cfg.use || portera_fncs.map(e => e.name); // ["log", "info", "warn", "error", "assert", "trace", "btrace", "stack", "dir"];
    cfg.nouse = cfg.nouse || [];
    setup();
    Tools.stringfyErrorJson();
  } catch (err) {
    throw new Error(`portera setup error: ${err.message}`);
  }
};

module.exports = portera;

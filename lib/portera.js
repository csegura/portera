const io = require('socket.io-client');

const portera = (host, obj) => {
  const setup = (host, obj) => {
    var socket = io(host);

    // replace basic
    ['log', 'info', 'warn', 'error'].forEach((e) => {
      //let fn = o[e];
      obj[e] = (...params) => {
        socket.emit('log', [e, params]);
      };
    });

    obj['trace'] = (...params) => {
      const err = new Error();
      err.name = 'Trace';
      socket.emit('log', ['trace', [params, err.stack]]);
    };

    // https://v8.dev/docs/stack-trace-api
    // better traces
    obj['brace'] = (...params) => {
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
          functionName: e.getFunctionName() || 'anonymous',
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
      socket.emit('log', ['trace', [params, stack]]);
    };

    obj['assert'] = (expression, ...args) => {
      if (!expression) {
        args[0] = `Assertion failed${args.length === 0 ? '' : `: ${args[0]}`}`;
        socket.emit('log', ['assert', args]);
      }
    };

    obj['stack'] = function stackIn() {
      function trace(fn) {
        if (fn && fn.name) {
          var args = [...fn.arguments];
          return trace(fn.caller) + fn.name + '(' + args.join(', ') + ')' + '\n';
        } else {
          return '';
        }
      }
      socket.emit('log', ['trace', [trace(stackIn.caller)]]);
    };
  };

  setup(host, obj);
};

module.exports = portera;

#!/usr/bin/env node

const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const chalk = require("chalk");
var stdio = require("stdio");

const public_web = path.join(__dirname, "./public");

var options = stdio.getopt({
  port: { key: "p", description: "port number", args: 1, default: "3001" },
  mode: { key: "m", description: "console mode (awe or normal)", args: 1, default: "awe" },
  silent: { key: "s", description: "silent mode, no console logs" },
});

// server
app.use(express.static(public_web));

io.on("connection", (socket) => {
  socket.on("log", (msg) => {
    io.emit("log", msg);
    if (!options.silent) {
      serverLog(msg);
    }
  });
  socket.on("perf", (msg) => {
    io.emit("perf", msg);
  });
});

server.listen(options.port, "0.0.0.0", () => {
  console.log(chalk.yellow("p_o_r_t_e_r_a"), "server is running on port", chalk.green(options.port));
  if (options.silent) {
    console.log("Silent mode shhhh....");
  } else {
    console.log("Output", chalk.cyan(options.mode));
    console.log("Watting for logs");
  }
});

function serverLog(msg) {
  const logTheme = {
    log: chalk.black.bgHex("#65b23e"),
    info: chalk.black.bgHex("#b2b23e"),
    warn: chalk.black.bgHex("#ffbb32"),
    error: chalk.black.bgHex("#ff3232"),
    trace: chalk.white.bgHex("#e53975"),
    assert: chalk.white.bgHex("#a58308"),
    stack: chalk.white.bgHex("#0094b2"),
    dir: chalk.black.bgHex("#39b4e5"),
  };

  const jsonTheme = {
    string: "#2a9292",
    number: "#00ffff",
    boolean: "#dda0dd",
    null: "#fafad2",
    key: "#add8e6",
    code: "#018d12",
    trace: "#ae81ff",
  };

  const highlight = (json, noCompatible) => {
    if (typeof json != "string") {
      json = JSON.stringify(json, undefined, 2);
    }

    if (noCompatible) {
      json = json.replace(/[\x09-\x0E]/gim, "\n").replace(/\\n\b/g, "\n"); // \n by <br/>
    }

    // Hat tip to PumBaa80 http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      highlightJson
    );
  };

  const color = logTheme[msg.kind] || chalk.red;
  const fmtTime = chalk.magentaBright.bgHex("#0b0b0b")(new Date(msg.time).toTimeString().substring(0, 8));
  const fmtKind = color(`[${msg.kind.padStart(5)}]`);

  let parts = msg.args.map((part, i) => {
    if (typeof part === "object") {
      if (options.mode === "awe") {
        part = highlight(part, true);
      } else if (options.mode === "normal") {
        part = highlight(part, false);
      } else {
        part = part;
      }
    }
    part = i > 0 ? "\n\t\t " + part.toString().replace(/(\n\r?)/g, "\n\t\t ") : part;
    return part;
  });

  if (parts.length === 1 && typeof parts[0] === "string") {
    parts[0] = parts[0].replace(/\n/g, "\n\t\t ");
  }
  console.log(`${fmtTime} ${fmtKind}`, ...parts);

  function highlightJson(match) {
    var cls = jsonTheme.number;
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = jsonTheme.key;
      } else {
        cls = jsonTheme.string;
        if (match.substr(1, 4) === "[fn]") {
          match = match.substring(5);
          cls = jsonTheme.code;
        }
        if (match.substr(1, 4) === "[tr]") {
          match = match.substring(5);
          cls = jsonTheme.trace;
        }
      }
    } else if (/true|false/.test(match)) {
      cls = jsonTheme.boolean;
    } else if (/null/.test(match)) {
      cls = jsonTheme.null;
    }
    return chalk.hex(cls)(match);
  }
}

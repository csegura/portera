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

const publicDirectoryPath = path.join(__dirname, "./public");

var options = stdio.getopt({
  port: { key: "p", description: "port number", args: 1, default: "3001" },
  mode: { key: "m", description: "console mode (awe or normal)", args: 1, default: "awe" },
  silent: { key: "s", description: "silent mode, no console logs" },
});

// server

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("log", (message) => {
    io.emit("log", message);
    if (!options.silent) {
      logConsole(message);
    }
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

function logConsole(message) {
  const logTheme = {
    log: chalk.gray,
    info: chalk.white,
    warn: chalk.yellow,
    error: chalk.red,
    trace: chalk.orange,
    assert: chalk.cyan,
    stack: chalk.green,
  };

  const highlightTheme = {
    string: "#2a9292",
    number: "#aa573c",
    boolean: "#b22222",
    null: "#955ae7",
    key: "#8b8792",
  };

  const highlightConsole = (json, noCompatible) => {
    if (typeof json != "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    // syntax on web is more clear with this replacements
    if (noCompatible) {
      json = json
        .replace(/(?:\\\\[rn])+/g, "\n") // pretty cr
        .replace(/\\n/g, "\n") // \n by <br/>
        .replace(/\\"/g, "'"); // change \" by '
    }

    // Hat tip to PumBaa80 http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = highlightTheme.number;
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = highlightTheme.key;
          } else {
            cls = highlightTheme.string;
          }
        } else if (/true|false/.test(match)) {
          cls = highlightTheme.boolean;
        } else if (/null/.test(match)) {
          cls = highlightTheme.null;
        }
        return chalk.hex(cls)(match);
      }
    );
  };

  const color = logTheme[message.kind] || chalk.red;

  const fmtTime = chalk.magenta(new Date(message.time).toTimeString().substring(0, 8));
  const fmtKind = color(`[${message.kind.padStart(5)}]`);

  let parts = message.args.map((part,i) => {
    if (typeof part === "object") {
      if (options.mode === "awe") {
        part = highlightConsole(part, true);
      } else if (options.mode === "normal") {
        part = highlightConsole(part, false);
      } else {
        part = part;
      }
    }
    part = i>0 ? "\n\t\t " + part.toString().replace(/(\n\r?)/g, "\n\t\t ") : part;
    return part;
  });
  
  if( parts.length === 1 && typeof parts[0] === "string" ) {
    parts[0] = parts[0].replace(/\n/g,"\n\t\t ");
  }
  console.log(`${fmtTime} ${fmtKind}`,...parts);
}

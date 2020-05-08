#!/usr/bin/env node

const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const chalk = require('chalk');

const publicDirectoryPath = path.join(__dirname, './public');

const port = process.env.PORTERA_PORT || 3001;
const consoleMode = process.env.PORTERA || 'AWESOME';

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  socket.on('log', (message) => {
    io.emit('log', message);
    logConsole(message);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log('Server is running on port', chalk.green(port));
  console.log('Output', chalk.cyan(consoleMode));
  console.log('Watting for logs');
});

function logConsole(message) {
  const [kind, parts] = message;
  let log = {
    time: new Date(),
    kind: kind,
    args: parts,
  };

  const logTheme = {
    log: chalk.gray,
    info: chalk.white,
    warn: chalk.yellow,
    error: chalk.red,
    trace: chalk.orange,
  };

  const highlightTheme = {
    string: '#2a9292',
    number: '#aa573c',
    boolean: '#b22222',
    null: '#955ae7',
    key: '#8b8792',
  };

  const highlightConsole = (json, noCompatible) => {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    // syntax on web is more clear with this replacements
    noCompatible = noCompatible || false;
    if (noCompatible) {
      json = json
        .replace(/(?:\\\\[rn])+/g, '\n') // pretty cr
        .replace(/\\n/g, '\n') // \n by <br/>
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

  const color = logTheme[log.kind] || chalk.red;

  const fmtTime = chalk.magenta(log.time.toTimeString().substring(0, 8));
  const fmtKind = color(`[${log.kind.padStart(5)}]`);

  let args = log.args.map((part) => {
    if (typeof part === 'object') {
      if (consoleMode === 'AWESOME') {
        part = highlightConsole(part, true);
      } else if (consoleMode === 'NORMAL') {
        part = highlightConsole(part, false);
      } else {
        part = part.join('\n');
      }
    }
    return part;
  });

  console.log(`${fmtTime} ${fmtKind}`, ...args);
}

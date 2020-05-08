const socket = io();

//get all of our elements
let allLogs = [];
let lastTime = Date.now();

// On log received
socket.on('log', (message) => {
  const [kind, parts] = message;
  const receivedTime = Date.now();
  let log = {
    time: receivedTime,
    kind: kind,
    args: parts,
    delta: receivedTime - lastTime,
  };
  lastTime = receivedTime;
  renderLogEntry(log);
  saveLog(log);
});

// https://unicode-table.com/es/#miscellaneous-symbols
const logStatus = {
  log: {
    visible: true,
    bg_color: ['bg-transparent'],
    bullet: '&#9679',
    bullet_color: ['text-green-600'],
  },
  info: {
    visible: true,
    bg_color: ['bg-indigo-900', 'bg-opacity-25'],
    bullet: '&#9679',
    bullet_color: ['text-blue-600'],
  },
  warn: {
    visible: true,
    bg_color: ['bg-indigo-900', 'bg-opacity-75'],
    bullet: '&#9679',
    bullet_color: ['text-orange-600'],
  },
  error: {
    visible: true,
    bg_color: ['bg-pink-900', 'bg-opacity-25'],
    bullet: '&#9679',
    bullet_color: ['text-pink-600'],
  },
  trace: {
    visible: true,
    bg_color: ['bg-indigo-900', 'bg-opacity-25'],
    bullet: '&#9654',
    bullet_color: ['text-teal-600'],
  },
};

function parse(parts) {
  let result = parts;
  if (parts.length == 1) {
    if (typeof parts[0] === 'Object') {
      //!= 'string' && typeof parts[0] != 'number') {
      result = highlightWeb(parts[0], true);
    } else {
      result = parts[0];
    }
  } else {
    result = parts.map((part) => (typeof part === 'object' ? highlightWeb(part, true) : part)).join('<br/>');
  }
  return result;
}

/**
 *  Create log entries
 */

function renderLogEntry(log) {
  const style = logStatus[log.kind];
  $('#log').prepend(elemRow(log, style));
}

function elemRow(log) {
  const elem = $('<div></div>', { class: 'flex flex-row mt-0 w-screen ml-5 bg-opacity-25 border-b-1 border-gray-100' });
  elem.addClass(log.kind);
  elem.append(elemInfo(log), elemContent(log));
  if (!logStatus[log.kind].visible) {
    elem.hide();
  }
  return elem;
}

function elemInfo(log) {
  const elem = $('<div>', { class: 'font-mono text-xs text-pink-600 w-16' });
  elem.addClass(logStatus[log.kind].bg_color);
  const bullet = $('<span>', { class: `${logStatus[log.kind].bullet_color}` });
  bullet.html(`&nbsp;${logStatus[log.kind].bullet}&nbsp;`);
  elem.html(moment(log.time).format('mm:ss'));
  elem.append(bullet);
  return elem;
}

function elemContent(log) {
  const div = $('<div>', { class: 'w-full' });
  const elem = $('<pre>', { class: 'font-mono text-xs text-gray-600 w-full break-all' });
  elem.addClass(logStatus[log.kind].bg_color);
  elem.html(parse(log.args));
  const delta = $('<div>', { class: 'float-right text-yellow-200 text-xs mr-5 z-40' });
  delta.html(`${log.delta}ms`);
  div.append(delta, elem);
  return div;
}

function highlightWeb(json, noCompatible) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  // syntax on web is more clear with this replacements
  noCompatible = noCompatible || false;

  // output json will be incompantible
  if (noCompatible) {
    json = json
      .replace(/(?:\\\\[rn])+/g, '\n') // pretty cr
      .replace(/\\n/g, '\n') // \n by <br/>
      .replace(/\\"/g, "'"); // change \" by '
  }

  // Hat tip to PumBaa80 http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

/**
 * UI
 */
$('#clearScreen').click(() => {
  $('#log').html('');
});

$('#clearAllLogs').click(() => {
  localStorage.setItem('allLogs', []);
});

/**
 * Session
 */

function saveLog(log) {
  allLogs.push(log);
  localStorage.setItem('allLogs', JSON.stringify(allLogs));
}

$(document).ready(() => {
  allLogs = JSON.parse(localStorage.getItem('allLogs') || '[]');
  console.log(allLogs);
  if (allLogs) {
    allLogs.forEach((e) => renderLogEntry(e));
  }

  // UI
  ['log', 'info', 'warn', 'trace', 'error'].forEach((e) => {
    const es = e + 's';
    const key = $('#toogleK' + e);
    key.click(() => {
      const elms = $('.' + e);
      logStatus[e].visible = !logStatus[e].visible;
      elms.fadeToggle(800);
      key.text(key.text() == 'show ' + es ? 'hide ' + es : 'show ' + es);
    });
  });
});

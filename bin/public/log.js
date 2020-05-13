const socket = io();

//get all of our elements
let logData = [];
let lastTime = Date.now();

// On log received
socket.on("log", (msg) => {
  const logTime = msg.time;
  msg.delta = logTime - lastTime;
  lastTime = logTime;
  render(msg);
  save(msg);
});

// renderjson
var level = getUrlParameter("l") || 4;
renderjson.set_icons("+", "-");
renderjson.set_show_to_level(level);

// https://unicode-table.com/es/#miscellaneous-symbols
const logStatus = {
  log: {
    visible: true,
    bg_color: ["bg-transparent"],
    bullet: "&#9679",
    bullet_color: ["text-green-600"],
  },
  info: {
    visible: true,
    bg_color: ["bg-indigo-900", "bg-opacity-25"],
    bullet: "&#9679",
    bullet_color: ["text-blue-600"],
  },
  warn: {
    visible: true,
    bg_color: ["bg-indigo-900", "bg-opacity-75"],
    bullet: "&#9679",
    bullet_color: ["text-orange-600"],
  },
  error: {
    visible: true,
    bg_color: ["bg-pink-900", "bg-opacity-25"],
    bullet: "&#9679",
    bullet_color: ["text-pink-600"],
  },
  trace: {
    visible: true,
    bg_color: ["bg-indigo-900", "bg-opacity-25"],
    bullet: "&#9654",
    bullet_color: ["text-teal-600"],
  },
  assert: {
    visible: true,
    bg_color: ["bg-red-900", "bg-opacity-25"],
    bullet: "&#9654",
    bullet_color: ["text-red-600"],
  },
  stack: {
    visible: true,
    bg_color: ["bg-blue-900", "bg-opacity-25"],
    bullet: "&#9654",
    bullet_color: ["text-blue-600"],
  },
  logobj: {
    visible: true,
    bg_color: ["bg-transparent"],
    bullet: "&#9679",
    bullet_color: ["text-green-200"],
  },
};

function parseArgs(elem, args) {
  if (args.length == 1) {
    if (typeof args[0] === "object") {
      elem.append(_renderjson(args[0]));
    } else {
      elem.html(args[0]);
    }
  } else {
    args.map((arg) => {
      if (typeof arg === "object") {
        elem.append(_renderjson(arg));
      } else {
        elem.append($("<div>").html(arg));
      }
    });
  }
}

function _renderjson(args) {
  return $("<div>", { class: ".json" }).append(renderjson(args));
}

/**
 *  Create log entries
 */
function render(msg) {
  const style = logStatus[msg.kind];
  var row = elemRow(msg, style);
  $("#log").prepend(row);
  //$("#" + msg.time)
  $(row)
    .get()
    .forEach((e) => {
      console.log(e);
      Prism.highlightAllUnder(e);
    });
}

function elemRow(log) {
  const elem = $("<div>", {
    class: "flex flex-row mt-0 w-screen ml-5 bg-opacity-25 border-b-1 border-gray-100",
  });
  elem.addClass(log.kind);
  elem.append(elemInfo(log), elemContent(log));
  if (!logStatus[log.kind].visible) {
    elem.hide();
  }
  return elem;
}

function elemInfo(log) {
  const elem = $("<div>", { class: "font-mono text-xs text-pink-600 w-18" });
  elem.addClass(logStatus[log.kind].bg_color);
  const bullet = $("<span>", { class: `${logStatus[log.kind].bullet_color}` });
  bullet.html(`&nbsp;${logStatus[log.kind].bullet}&nbsp;`);
  elem.html(moment(log.time).format("hh:mm:ss"));
  elem.append(bullet);
  return elem;
}

function elemContent(log) {
  const div = $("<div>", { class: "w-full" });
  const elem = $("<div>", { class: "font-mono text-xs text-gray-600 w-full break-all" });
  elem.addClass(logStatus[log.kind].bg_color);
  parseArgs(elem, log.args);
  const delta = $("<div>", { class: "float-right text-yellow-200 text-xs mr-5" });
  delta.html(`${log.delta}ms`);
  div.append(delta, elem);
  return div;
}

/**
 * UI
 */
$("#clearScreen").click(() => {
  $("#log").html("");
});

$("#clearAllLogs").click(() => {
  localStorage.setItem("logData", []);
});

/**
 * Session
 */
function save(msg) {
  logData.push(msg);
  localStorage.setItem("logData", JSON.stringify(logData));
}

/**
 * Start
 */
$(document).ready(() => {
  logData = JSON.parse(localStorage.getItem("logData") || "[]");
  if (logData) {
    logData.forEach((e) => render(e));
  }

  // UI
  ["log", "info", "warn", "trace", "error", "logobj"].forEach((e) => {
    const es = e + "s";
    const key = $("#toogleK" + e);
    key.click(() => {
      const elms = $("." + e);
      logStatus[e].visible = !logStatus[e].visible;
      elms.fadeToggle(800);
      key.text(key.text() == "show " + es ? "hide " + es : "show " + es);
    });
  });
});

/**
 *  Parameters
 */
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

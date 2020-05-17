const socket = io();

//get all of our elements
let logData = [];
let lastTime = Date.now();
let groupList = [];

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

const btns = {
  log: true,
  info: true,
  warn: true,
  error: true,
  trace: true,
  assert: true,
  stack: true,
  dump: true,
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
  var row = elemRow(msg);
  $("#log").prepend(row);

  $(row)
    .get()
    .forEach((e) => {
      Prism.highlightAllUnder(e);
    });
}

function elemRow(log) {
  const elem = $("<div>", {
    class: "log_row",
  });
  elem.addClass(log.kind);
  elem.attr("data", log.group);
  elem.append(elemInfo(log), elemContent(log));
  if (!btns[log.kind]) {
    elem.hide();
  }
  updateGroups(log);
  return elem;
}

function elemInfo(log) {
  const elem = $("<div>", { class: "log_info" });
  const bullet = $("<span>", { class: `${log.kind}` });
  elem.html(moment(log.time).format("hh:mm:ss"));
  elem.append(bullet);
  return elem;
}

function elemContent(log) {
  const div = $("<div>", { class: "log_entry" });
  const elem = $("<div>", { class: "log_content" });
  const span = $("<span>", { class: "log_group" });
  span.text(log.group);
  elem.append(span);
  parseArgs(elem, log.args);
  const delta = $("<div>", { class: "log_delta" });
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
  const json = JSON.stringify(logData);
  if (json.length >= 5142880 && json.length < 5146880) {
    render({
      kind: "warn",
      args: "localStorage is near to be full 😱 are you interested in save logs?",
      time: Number(Date.now()),
      delta: 0,
    });
  }
  if (json.length < 524000) {
    localStorage.setItem("logData", json);
  } else {
    console.warn(":-( portera has this limitation .. are you interested in save logs? tell me!! ");
    logData = [];
  }
}

function updateGroups(msg) {
  const group = msg.group;
  if (groupList.indexOf(group) == -1) {
    groupList.push(group);
    const opt = $("<option>").attr("value", group);
    $("#group_list").append(opt);
    $("#search").attr("list", "group_list");
  }
}

function filterGroup(txt) {
  if (txt) {
    const rexp = new RegExp(txt, "ig");
    $("#log > div:visible").each((i, e) => {
      var el = $(e).attr("data");
      if (el && el.match(rexp)) {
        $(e).show();
      } else {
        $(e).hide();
      }
    });
  } else {
    $("#log > div").show();
    setButtonStatus(true);
  }
}

function setButtonStatus(visibles) {
  Object.keys(btns).forEach((k) => {
    const button = $("#toogleK" + k);
    if (btns[k] || visibles) {
      if (visibles) btns[k] = true;
      button.text("🔊 " + k);
    } else {
      button.text("🔈 " + k);
    }
  });
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
  Object.keys(btns).forEach((k) => {
    const key = $("#toogleK" + k);
    key.click(() => {
      const elms = $("." + k);
      btns[k] = !btns[k];
      btns[k] ? elms.fadeIn(800) : elms.fadeOut(800);
      setButtonStatus(false);
    });
  });

  $("#toogle").click(() => {
    var a = $("#toogle");
    $("span:visible > a.disclosure")
      .get()
      .forEach((e) => e.click(e));
    a.text(a.text() == "🥚" ? "🐣" : "🥚");
  });

  $("#search").on("change keydown input", () => {
    filterGroup($("#search").val());
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

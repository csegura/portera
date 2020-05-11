const socket = io();

let pfData = [];
var chart;
const MAX_RENDER_POINTS = 200;

// On performance data received
socket.on("perf", (msg) => {
  render(msg);
  save(msg);
});

/**
 *  Create performance entries
 */
function render(msg) {
  var d = chart.data.datasets;
  var t = new Date(msg.time);
  d[0].data.push({ y: hrToMs(msg.el), x: t });
  d[1].data.push({ y: msToMs(msg.cpu.user), x: t });
  d[2].data.push({ y: msToMs(msg.cpu.system), x: t });
  d[3].data.push({ y: bytesToMB(msg.mem.heapUsed), x: t });
  d[4].data.push({ y: bytesToMB(msg.mem.heapTotal), x: t });
  chart.update();
  if (d[0].data.length > MAX_RENDER_POINTS) {
    d.forEach(d => d.data.shift());
  }
}

function hrToMs(hrtime) {
  return hrtime[0] * 1000.0 + hrtime[1] / 1000000.0;
}
function msToMs(ns) {
  return ns / 1000.0;
}
function bytesToMB(bytes) {
  return bytes / 1024.0 / 1024.0;
}

/**
 * UI
 */
$("#clearScreen").click(() => {
  var d = chart.data.datasets;
  d.forEach(d => d.data = []);
  chart.update();
});

$("#clearData").click(() => {
  localStorage.setItem("pfData", []);
});

/**
 * Session
 */
function save(log) {
  pfData.push(log);
  localStorage.setItem("pfData", JSON.stringify(pfData));
}

/**
 * Start
 */

$(document).ready(() => {
  var ctx = $("#chart");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "event loop",
          data: [],
          borderWidth: 1,
          borderColor: "#3e95cd",
          fill: false,
          yAxisID: "y-axis-ms",
        },
        {
          label: "cpu.user",
          data: [],
          borderWidth: 1,
          borderColor: "#b22222",
          fill: false,
          yAxisID: "y-axis-ms",
        },
        {
          label: "cpu.system",
          data: [],
          borderWidth: 1,
          borderColor: "#955ae7",
          fill: false,
          yAxisID: "y-axis-ms",
        },
        {
          label: "heap",
          data: [],
          borderWidth: 1,
          borderColor: "#2a9292",
          fill: false,
          borderDash: [5,5],
          yAxisID: "y-axis-mb",
        },
        {
          label: "heap.total",
          data: [],
          borderWidth: 1,
          borderColor: "#aa573c",
          fill: false,
          borderDash: [10,5],
          yAxisID: "y-axis-mb",
        },
      ],
    },
    options: {
      legend: {
        display: true,
        labels: {
          fontColor: "white",
        },
      },
      title: {
        display: true,
        text: "portera performance analytics",
        position: "top",
        fontSize: 16,
        padding: 20,
        fontColor: "white",
      },
      scales: {
        yAxes: [
          {
            type: "linear", 
            display: true,
            position: "left",
            id: "y-axis-ms",
            ticks: {
              fontColor: "#3e95cd",
            },
            gridLines: {
              color: "#0e0e0e", 
              display: true, 
            },
            scaleLabel: {
              display: true,
              fontSize: 14,
              labelString: "ms",
            },
          },
          {
            type: "linear", 
            display: true,
            position: "right",
            id: "y-axis-mb",
            // grid line settings
            gridLines: {
              drawOnChartArea: false, 
            },
            scaleLabel: {
              display: true,
              fontSize: 14,
              labelString: "MB",
            },
            ticks: {
              fontColor: "#2a9292",
            },
          },
        ],
        xAxes: [
          {
            type: "time",
            distribution: "series",
            position: "bottom",
            ticks: {
              fontColor: "#3e95cd",
            },
            gridLines: {
              color: "#0e0e0e", 
              display: true, 
            },
          },
        ],
      },
    },
  });
  // restore
  pfData = JSON.parse(localStorage.getItem("pfData") || "[]");
  console.log(pfData);
  if (pfData) {
    pfData.forEach((e) => render(e));
  }
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

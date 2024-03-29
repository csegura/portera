const socket = io();

let pfData = [];

var charts = [];

var chart1, chart2;
const MAX_RENDER_POINTS = 100;

// On performance data received
socket.on("perf", (msg) => {
  render(msg);
  save(msg);
});

/**
 *  Create performance entries
 */
function render(msg) {
  var chart = getChart("el");

  var data = getDataset(chart);
  var t = new Date(msg.time);

  data[0].data.push({ y: hrToMs(msg.el), x: t });

  chart = getChart("cm");
  data = getDataset(chart);
  data[0].data.push({ y: msToMs(msg.cpu.user), x: t });
  data[1].data.push({ y: msToMs(msg.cpu.system), x: t });
  data[2].data.push({ y: bytesToMB(msg.mem.heapUsed), x: t });
  data[3].data.push({ y: bytesToMB(msg.mem.heapTotal), x: t });

  shiftDatasetIfNeeded();
  updateCharts();
}

/**
 * UI
 */
$("#clearScreen").click(() => {
  clearDatasets();
  updateCharts();
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
  var ctx = $("#chart1");
  chart_el = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "event loop",
          data: [],
          borderWidth: 1,
          borderColor: "#3e95cd",
          fill: false,
          type: "line",
          yAxisID: "y-axis-ms",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: true,
        labels: {
          fontColor: "white",
        },
      },
      title: {
        display: true,
        text: "portera performance monitor",
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

  charts.push({ name: "el", chart: chart_el });

  ctx = $("#chart2");
  chart_cpumem = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
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
          borderDash: [5, 5],
          yAxisID: "y-axis-mb",
        },
        {
          label: "heap.total",
          data: [],
          borderWidth: 1,
          borderColor: "#aa573c",
          fill: false,
          borderDash: [10, 5],
          yAxisID: "y-axis-mb",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: true,
        labels: {
          fontColor: "white",
        },
      },
      title: {
        display: true,
        //text: "portera performance monitor",
        position: "top",
        fontSize: 16,
        padding: 5,
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
            scaleLabel: {
              display: true,
              fontSize: 6,
            },
          },
        ],
      },
    },
  });

  charts.push({ name: "cm", chart: chart_cpumem });

  // restore
  pfData = JSON.parse(localStorage.getItem("pfData") || "[]");
  if (pfData) {
    pfData.forEach((e) => render(e));
  }
});

/**
 * chart managemet
 */

function getChart(chartName) {
  var chart = charts.find((chart) => chart.name == chartName);
  return chart.chart;
}

function getDataset(chart) {
  return chart.data.datasets;
}

function updateCharts() {
  charts.map((c) => c.chart.update());
}

function shiftDatasetIfNeeded() {
  charts.map((c) => {
    getDataset(c.chart).forEach((d) => {
      if (d.data.length > MAX_RENDER_POINTS) {
        d.data.shift();
      }
    });
  });
}

function clearDatasets() {
  charts.map((c) => {
    getDataset(c.chart).forEach((d) => (d.data = []));
  });
}

/**
 *  Adjust measures
 */

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
 *  Parameters
 */
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

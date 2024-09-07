let depositChartInstance = null;
let withdrawalChartInstance = null;

const periods = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

function renderPeriodButtons(periodVal) {
  const periodContainer = document.getElementById("periodSelector");
  periodContainer.innerHTML = "";

  const urlParams = new URLSearchParams(window.location.search);
  let selectedPeriod = periodVal || "week";

  periods.forEach((period) => {
    const button = document.createElement("div");
    button.className = `item${
      selectedPeriod === period.value ? " is-active" : ""
    }`;
    button.innerHTML = `
      <div class="period-item">
        <b class="network-bold">${period.label}</b>
        <span class="period-checkbox"></span>
      </div>
    `;

    button.onclick = () => {
      setPeriod(period.value);
    };

    periodContainer.appendChild(button);
  });
}

function setPeriod(selectedPeriod) {
  renderPeriodButtons(selectedPeriod);

  renderAll(selectedPeriod);
}

document.addEventListener("DOMContentLoaded", function () {
  renderPeriodButtons();

  renderAll();
});

function renderAll(periodVal) {
  const depositCanvas = document.getElementById("depositChart");
  const withdrawalCanvas = document.getElementById("withdrawalChart");

  const currency = JSON.parse(document.getElementById("currency").textContent);
  const data_deposit = JSON.parse(
    document.getElementById("data_deposit").textContent
  );
  const data_withdrawal = JSON.parse(
    document.getElementById("data_withdrawal").textContent
  );
  const chain_id = JSON.parse(document.getElementById("chain_id").textContent);

  let period = periodVal || "week"; // day, week, month

  depositChartInstance = renderChart(
    depositCanvas,
    data_deposit,
    "Deposit",
    currency,
    chain_id,
    period,
    depositChartInstance
  );

  withdrawalChartInstance = renderChart(
    withdrawalCanvas,
    data_withdrawal,
    "Withdrawal",
    currency,
    chain_id,
    period,
    withdrawalChartInstance
  );
}

function getChain(chain_id) {
  let chain;

  switch (chain_id) {
    case "1":
      chain = "Ethereum Mainnet";
      break;
    case "5":
      chain = "Ethereum Goerli";
      break;
    case "56":
      chain = "Binance Smart Chain";
      break;
    case "100":
      chain = "Gnosis Chain";
      break;
    case "137":
      chain = "Polygon (Matic) Network";
      break;
    case "42161":
      chain = "Arbitrum One";
      break;
    case "43114":
      chain = "Avalanche Mainnet";
      break;
    case "10":
      chain = "Optimism";
      break;
    default:
      chain = "Unknown Network";
  }
  return chain;
}
function renderChart(
  canvas,
  data,
  tornado_action,
  currency,
  chain_id,
  period,
  chartInstance
) {
  const chain = getChain(chain_id);
  const colours = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

  // Destroy the existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const aggregatedData = aggregateData(data, period, currency, colours);
  const datasets = aggregatedData.datasets.map((dataset, index) => ({
    label: dataset.label,
    data: dataset.data,
    backgroundColor: dataset.backgroundColor,
    borderColor: dataset.borderColor,
    borderWidth: dataset.borderWidth,
    barThickness: dataset.barThickness,
  }));

  const chartData = {
    labels: aggregatedData.labels,
    datasets: datasets,
  };

  const ctx = canvas.getContext("2d");

  const newChart = new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Tornado Cash ${currency} ${tornado_action} over time for ${chain}`,
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
        legend: {
          position: "top",
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: `Time (${period})`,
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: `Number of ${tornado_action}s`,
          },
          beginAtZero: true,
        },
      },
    },
  });

  return newChart;
}
function aggregateData(data, period, currency, colours) {
  const aggregated = {};
  const datasetKeys = Object.keys(data.datasets);

  // Helper function to get the start of the week
  function getStartOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // Helper function to format the date
  function formatDate(date, format) {
    switch (format) {
      case "day":
        return new Date(date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      case "week":
        return getStartOfWeek(date);
      case "month":
        return new Date(date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
        });
      default:
        return new Date(date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
    }
  }

  // Initialise aggregation for each dataset
  datasetKeys.forEach((key) => {
    const dataset = data.datasets[key];
    if (!Array.isArray(dataset.counts)) {
      console.error("Invalid dataset format: dataset.counts is not an array");
      return;
    }
    data.labels.forEach((label, index) => {
      const periodLabel = formatDate(label, period);
      if (!aggregated[periodLabel]) {
        aggregated[periodLabel] = new Array(datasetKeys.length).fill(0);
      }
      aggregated[periodLabel][datasetKeys.indexOf(key)] +=
        dataset.counts[index];
    });
  });

  return {
    labels: Object.keys(aggregated),
    datasets: datasetKeys.map((key, datasetIndex) => ({
      label: `${key} ${currency}`,
      data: Object.values(aggregated).map((d) => d[datasetIndex]),
      backgroundColor: colours[datasetIndex % colours.length],
      borderColor: colours[datasetIndex % colours.length],
      borderWidth: 1,
      barThickness: 1,
    })),
  };
}

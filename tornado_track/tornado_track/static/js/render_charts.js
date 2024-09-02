document.addEventListener("DOMContentLoaded", function () {
  const depositCanvas = document.getElementById("depositChart");
  const withdrawalCanvas = document.getElementById("withdrawalChart");

  const currency = JSON.parse(document.getElementById("currency").textContent);
  const data_deposit = JSON.parse(
    document.getElementById("data_deposit").textContent
  );
  console.log(data_deposit);
  const data_withdrawal = JSON.parse(
    document.getElementById("data_withdrawal").textContent
  );
  const chain_id = JSON.parse(document.getElementById("chain_id").textContent);

  renderChart(depositCanvas, data_deposit, "Deposit", currency, chain_id);
  renderChart(
    withdrawalCanvas,
    data_withdrawal,
    "Withdrawal",
    currency,
    chain_id
  );
});

function getChain(chain_id) {
  console.log(chain_id);
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

function renderChart(canvas, data, tornado_action, currency, chain_id) {
  const chain = getChain(chain_id);
  const colours = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];
  const datasets = Object.entries(data.datasets).map(
    ([amount, value], index) => ({
      label: `${amount} ${currency}`,
      data: value.counts,
      backgroundColor: colours[index % colours.length],
      borderColor: colours[index % colours.length],
      borderWidth: 1,
      barThickness: 1,
    })
  );

  const chartData = {
    labels: data.labels,
    datasets: datasets,
  };

  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
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
}

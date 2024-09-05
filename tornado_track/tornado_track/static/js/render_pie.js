document.addEventListener("DOMContentLoaded", function () {
  const data = JSON.parse(
    document.getElementById("contract_storage").textContent
  );

  // Extract labels and data
  const labels = data.map((item) => item.amount);
  const storedData = data.map((item) => item.stored);
  const currency = JSON.parse(document.getElementById("currency").textContent);

  // Create the chart
  const ctx = document.getElementById("pieChart").getContext("2d");
  const pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Stored ${currency}`,
          data: storedData,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  let mapping = {
    ETH: "ethereum",
    WBTC: "wrapped-bitcoin",
    DAI: "dai",
    CDAI: "cdai",
    XDAI: "xdai",
    AVAX: "avalanche-2",
    MATIC: "matic-network",
  };

  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${mapping[currency]}&vs_currencies=usd`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let usdVal = 1;
      try {
        usdVal = data[mapping[currency]].usd;
      } catch (error) {}
      const stored_el = document.getElementById("total-stored");
      const stored_el_usd = document.getElementById("total-stored-usd");
      const sum = storedData.reduce((total, current) => total + current, 0);

      const formattedSum = sum.toLocaleString();
      const formattedValueInUsd = (sum * usdVal).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      stored_el.innerHTML = `Total ${currency} Stored: ${formattedSum}`;
      stored_el_usd.innerHTML = `Value in USD: $${formattedValueInUsd}`;
    })
    .catch((error) => console.error("Error fetching price:", error));
});

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

  const stored_el = document.getElementById("total-stored");
  const sum = storedData.reduce((total, current) => total + current, 0);
  stored_el.innerHTML = `Total ${currency} Stored: ${sum}`;
});

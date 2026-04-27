let data = JSON.parse(localStorage.getItem("carbonData")) || [];

const ctx = document.getElementById("chart").getContext("2d");

let chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "CO₂ Emissions (lbs/month)",
      data: [],
      fill: false,
      tension: 0.3
    }]
  }
});

function calculate(electricity, car, flights) {
  let electricityCO2 = electricity * 0.92;
  let carCO2 = car * 0.79;
  let flightCO2 = (flights * 250) / 12;
  return electricityCO2 + carCO2 + flightCO2;
}

function addEntry() {
  let electricity = document.getElementById("electricity").value || 0;
  let car = document.getElementById("car").value || 0;
  let flights = document.getElementById("flights").value || 0;

  let total = calculate(electricity, car, flights);

  let entry = {
    date: new Date().toLocaleDateString(),
    total: total
  };

  data.push(entry);
  localStorage.setItem("carbonData", JSON.stringify(data));

  updateUI();
}

function updateUI() {
  // Latest result
  let latest = data[data.length - 1];
  document.getElementById("result").innerText =
    latest.total.toFixed(2) + " lbs CO₂ / month";

  // Comparison
  let avgUS = 3000;
  let comparison = latest.total < avgUS
    ? "Below U.S. average!"
    : "Above U.S. average";

  document.getElementById("comparison").innerText = comparison;

  // Update chart
  chart.data.labels = data.map(e => e.date);
  chart.data.datasets[0].data = data.map(e => e.total);
  chart.update();

  // Update history
  let historyList = document.getElementById("history");
  historyList.innerHTML = "";

  data.slice().reverse().forEach(e => {
    let li = document.createElement("li");
    li.textContent = `${e.date}: ${e.total.toFixed(1)} lbs`;
    historyList.appendChild(li);
  });
}

// Load saved data on start
updateUI();

const urlParams = new URLSearchParams(window.location.search);
let selectedNetwork = urlParams.get("id") || "1";
let selectedCrypto = urlParams.get("currency") || "ETH";
var chainData;
var networkNames;

fetch("/cryptos")
  .then((response) => response.json())
  .then((data) => {
    networkNames = Object.keys(data).reduce((names, networkId) => {
      switch (networkId) {
        case "1":
          names[networkId] = ["Ethereum Mainnet", "ethereum"];
          break;
        case "5":
          names[networkId] = ["Ethereum Goerli", "goerli"];
          break;
        case "56":
          names[networkId] = ["Binance Smart Chain", "binance"];
          break;
        case "100":
          names[networkId] = ["Gnosis Chain", "gnosis"];
          break;
        case "137":
          names[networkId] = ["Polygon (Matic) Network", "polygon"];
          break;
        case "42161":
          names[networkId] = ["Arbitrum One", "arbitrum"];
          break;
        case "43114":
          names[networkId] = ["Avalanche Mainnet", "avalanche"];
          break;
        case "10":
          names[networkId] = ["Optimism", "optimism"];
          break;
        default:
          names[networkId] = ["Unknown Network", "unknown network"];
      }
      return names;
    }, {});

    chainData = data;
    renderNetworks();
    renderCryptos();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function renderNetworks() {
  const networkList = document.getElementById("networkList");
  networkList.innerHTML = "";

  for (const chainId in chainData) {
    const networkItem = document.createElement("div");
    let net_name = networkNames[chainId][0];
    let svg_name = networkNames[chainId][1];
    networkItem.className = `item${
      selectedNetwork === chainId ? " is-active" : ""
    }`;
    networkItem.onclick = () => setNetwork(chainId);
    const imageUrl = `/static/img/icons/${svg_name}.svg`;

    networkItem.innerHTML = `
            <img class="network-icon" src="${imageUrl}" alt="${net_name}" width=20>
            <b class="network-bold">${net_name}</b>
            <span class="network-checkbox"></span>
        `;
    networkList.appendChild(networkItem);
  }
}

function renderCryptos() {
  const cryptoList = document.getElementById("cryptoList");
  cryptoList.innerHTML = "";

  if (selectedNetwork) {
    for (const crypto in chainData[selectedNetwork]) {
      const cryptoItem = document.createElement("div");
      cryptoItem.className = `item${
        selectedCrypto === crypto ? " is-active" : ""
      }`;
      cryptoItem.onclick = () => setCrypto(crypto);
      cryptoItem.innerHTML = `
                <b class="network-bold">${crypto}</b>
                <span class="crypto-checkbox"></span>
            `;
      cryptoList.appendChild(cryptoItem);
    }
  } else {
    cryptoList.innerHTML += "<p>Please select a network first</p>";
  }
}

function setNetwork(chainId) {
  selectedNetwork = chainId;
  selectedCrypto = null;
  renderNetworks();
  renderCryptos();
}

function setCrypto(crypto) {
  selectedCrypto = crypto;

  renderCryptos();

  window.location.href = `/?id=${selectedNetwork}&currency=${selectedCrypto}`;
}

const cryptos = [{ id: 1, name: "Bitcoin", symbol: "BTC", icon: "btc-icon.png", iconm: "btc-icon.png", color: "#ffa500", isFiat: false },
{ id: 2, name: "Litecoin", symbol: "LTC", icon: "ltc-icon.png", iconm: "ltc-icon.png", color: "#8e9dc2", isFiat: false },
{ id: 3, name: "Ethereum", symbol: "ETH", icon: "eth-icon.png", iconm: "eth-icon.png", color: "#9750ff", isFiat: false },
{ id: 4, name: "Ripple", symbol: "XRP", icon: "xrp-icon.png", iconm: "xrp-icon.png", color: "#739bee", isFiat: false },
{ id: 5, name: "Stellar", symbol: "XLM", icon: "xlm-icon.png", iconm: "xlm-icon.png", color: "#dcf2f9", isFiat: false },
{ id: 6, name: "Coin", symbol: "XCM", icon: "xlm-icon.png", iconm: "xlm-icon.png", color: "#dcf2f9", isFiat: false },
{ id: 7, name: "US Dollar", symbol: "USD", icon: "usd-icon.png", iconm: "usd-icon.png", color: "#4db648", isFiat: true },
{ id: 8, name: "Cardano", symbol: "ADA", icon: "ada-icon.png", iconm: "ada-icon.png", color: "#38c4c4", isFiat: true },
{ id: 9, name: "Eosio", symbol: "EOS", icon: "eos-icon.png", iconm: "eos-icon.png", color: "#292929", isFiat: false },
{ id: 11, name: "Neo", symbol: "NEO", icon: "neo-icon.png", iconm: "neo-icon.png", color: "#45af00", isFiat: false },
{ id: 12, name: "Tron", symbol: "TRX", icon: "trx-icon.png", iconm: "trx-icon.png", color: "#292929", isFiat: false },
{ id: 13, name: "OmiseGO", symbol: "OMG", icon: "omg-icon.png", iconm: "omg-icon.png", color: "#1446ec", isFiat: false },
{ id: 14, name: "Vechain", symbol: "VEN", icon: "ven-icon.png", iconm: "ven-icon.png", color: "#0faeff", isFiat: false },
{ id: 15, name: "Nem", symbol: "XEM", icon: "xem-icon.png", iconm: "xem-icon.png", color: "#60ace5", isFiat: false }]

export const getCrypto = (query) => {
  if (!query)
    return cryptos;

  const { symbol, id } = query;

  return cryptos.find(crypto => crypto.symbol.toUpperCase() === (symbol || "").toUpperCase() || crypto.id === id);
};

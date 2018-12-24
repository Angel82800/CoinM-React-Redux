import React, { Component } from "react";

Number.prototype.toPrecisionMyMy = function (p) {
  return parseFloat(this.toPrecisionMy(p)).toFixed(10).replace(/0/g, ' ').trimRight().replace(/ /g, '0').replace(/\.$/, '.0');
};

class ExchangeActionsRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { crypto } = this.props;
    if (!(crypto || {}).var24hUSD)
      return null;

    return (
      <div className="ex-crypto-stats">
        <div className="ex-stats-title">
          <div>
            <img className="ex-small-icon" src={`assets/images/${crypto.icon}`} alt="" />
            <div>
              <p className="fs14bw m-0">{crypto.name}</p>
              <p className="fs12umw m-0 op5">{crypto.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="m-0 fs12bw">
              {(crypto.rateUSD || 0).toPrecisionMy(4)}$
              <span className="colg ml-1">
                {(crypto.var24hUSD || 0).toPrecisionMy(4)}%
                <i className="fas fa-sort-up ml-1" />
              </span>
            </p>
            <p className="m-0 fs12bw">
              <span className="op5">{(crypto.rateBTC || 0).toPrecisionMy(4)} BTC</span>
              <span className="colg ml-1">
                {(crypto.var24hBTC || 0).toPrecisionMy(4)}%
                <i className="fas fa-sort-up ml-1" />
              </span>
            </p>
          </div>
        </div>
        <div className="ex-stats-data">
          <div className="ex-stats-data-c">
            <div className="ex-stats-data-row">
              <p>
                <i className="fas fa-dollar-sign" />
                <span className="op5">Last price:</span>
              </p>
              <p>{(crypto.rateUSD || 0).toPrecisionMy(4)}$</p>
            </div>
            <div className="ex-stats-data-row">
              <p>
                <i className="fas fa-database fs12" />
                <span className="op5">Available Volume:</span>
              </p>
              <p>???</p>
            </div>
            <div className="ex-stats-data-row">
              <p>
                <i className="fas fa-sort" />
                <span className="op5">High - Low:</span>
              </p>
              <p>{(crypto.high24h || 0).toPrecisionMy(4)}$ - {(crypto.low24h || 0).toPrecisionMy(4)}$</p>
            </div>
            <div className="ex-stats-data-row">
              <p>
                <i className="far fa-clock" />
                <span className="op5">24h Volume:</span>
              </p>
              <p>{(crypto.vol24h || 0).toPrecisionMy(4)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ExchangeActionsRow;

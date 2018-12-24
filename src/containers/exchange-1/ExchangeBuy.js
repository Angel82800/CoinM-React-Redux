import React, { Component } from "react";

import { getCrypto } from "../../constants/Cryptos";
import { ExchangeActions } from "../../redux/app/actions";
import { connect } from "react-redux";

const getLast = array => (array && array.length && array[array.length - 1]) || {};
Number.prototype.toPrecisionMy = function (p) {
  return parseFloat(this.toPrecision(p)).toFixed(10).replace(/0/g, ' ').trimRight().replace(/ /g, '0').replace(/\.$/, '.0');
};

class ExchangeBuy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeframe: 14400000
    };

    this.stxx = null;
    this.timeframes = [
      { text: "5M", ms: 300000 },
      { text: "30M", ms: 1800000 },
      { text: "4H", ms: 14400000 },
      { text: "1D", ms: 86400000 }
    ];
  }

  componentDidMount() {
    console.log('exchangeBuyMounted');
    var { crypto, theme, pos } = this.props;
    crypto = crypto || {};

    this.stxx = new CIQ.ChartEngine({
      container: $$$(".chart-b-" + pos),
      layout: { "chartType": "mountain" }
    });

    this.stxx.chart.yAxis.initialMarginTop = 50;
    this.stxx.setMaxTicks(200);
    this.stxx.setStyle("stx_mountain_chart", "color", theme.baseC);
    this.stxx.setStyle("stx_mountain_chart", "borderTopColor", theme.borderC);
    this.stxx.setStyle("stx_mountain_chart", "backgroundColor", "rgba(54, 65, 95, 1)");
  }

  componentDidUpdate() {
    const { crypto: { symbol } } = this.props;

    if (!symbol)
      return;

    const pair = symbol + "USD";
    const { timeframe } = this.state;


    const dataPromises = [
      this.props.getCandleHistory({
        token: this.props.userToken,
        data: {
          pair,
          timeframe,
          from: (getLast(((this.props.candleHistory || {})[pair] || {})[timeframe]).DT && this.props.candleHistory[pair][timeframe].length > 50) || 0
        }
      })
    ];

    Promise.all(dataPromises)
      .then(() => {
        this.drawChart();
      });
  }

  drawChart = () => {
    const { crypto, candleHistory, pos } = this.props;

    const masterData = JSON.parse(JSON.stringify(((candleHistory || {})[(crypto || {}).symbol + "USD"] || {})[this.state.timeframe] || []));
    this.stxx.newChart("SPY", masterData, null, () => {
      var inputs = {
        "Period": 50,
        "Field": "Close",
        "Type": "ma"
      };

      var outputs = {
        "MA": "#fff500"
      };
    });
  };

  setTimeframe = (timeframe) => this.setState({ timeframe });

  setAction = (e) => {
  };

  render() {
    var { crypto, theme, pos } = this.props;
    crypto = crypto || {};
    const { name, symbol, iconm } = crypto;

    return (
      <div id={"ex-buy-range-" + pos} className="exchange-buy-con">
        <div className="exchange-charts-range">
          <div className="exchange-range-container text-center">
            {this.timeframes.map((timeframe, index) => (
              <div className={"exchange-range-but" + (this.state.timeframe === timeframe.ms ? " active" : "")}
                onClick={() => this.setTimeframe(timeframe.ms)} key={index}>
                {timeframe.text}
              </div>
            ))}
          </div>
        </div>

        <div className="exchange-charts ciq-night">
          <div className={"chartContainer " + "chart-b-" + pos} />
        <h2 className="noselect hidden-xs-down">{crypto.rateUSD && crypto.rateUSD.toPrecisionMy(6)} US$</h2>
        </div>

        <div className={"exchange-navigation " + theme.class}>
          <div className="exchange-navigation-box">

            <div className="exchange-navigation-top d-flex">
              <div>
                <div className="ibox">
                  <img src={"/assets/images/" + iconm} />
                  <span className="iname" style={{ width: "100%" }}>{name}</span>
                  <span className="isymbol">{symbol}</span>
                </div>
              </div>

              <div className="ml-auto">
                <p>
                  <span>{crypto.rateUSD && crypto.rateUSD.toPrecision(4)}</span>
                  <span>US$</span>
                  <span className="green">({this.state.perc}%)</span>
                  <i className="fa fa-sort-asc green" aria-hidden="true" />
                </p>
                <p>
                  <span className="op5">{crypto.rateBTC && crypto.rateBTC.toPrecisionMy(6)}</span>
                  <span className="op5">BTC</span>
                  <span className="green">({this.state.perc}%)</span>
                  <i className="fa fa-sort-asc green" aria-hidden="true" />
                </p>
              </div>
            </div>

            {/*
            <div className="exchange-navigation-bottom">
              <span className="nb" onClick={this.setAction}>trade</span>
              <span className={`nb ${this.props.exchangeActive ? "active" : ""}`} onClick={this.props.onClickExchange}>exchange</span>
              <span className={`nb ${this.props.transferActive ? "active" : ""}`} onClick={this.props.onClickTransfer}>transfer</span>
            </div>
*/}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.userReducer.userId,
    userToken: state.userReducer.userToken,
    candleHistory: state.exchangeReducer.candleHistory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCandleHistory: (req) => dispatch(ExchangeActions.getCandleHistory(req.data, req.token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeBuy);

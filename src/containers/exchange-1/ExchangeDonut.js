import React, { Component } from "react";
import { getCrypto } from "../../constants/Cryptos";
import ExchangeCryptoChart from "./ExchangeCryptoChart";


class ExchangeDonut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDonut: true,
      data: []
    };
  }

  getDonutData = (props) => {
    const totalAmount = (props.cryptos || []).reduce((sum, crypto) => sum + (crypto.amountUSD || 0), 0);
    return props.cryptos.filter(c => c.amount > 0).map(crypto => ({
      amount: crypto.amount,
      amountUSD: crypto.amountUSD,
      symbol: crypto.symbol,
      hvalue: totalAmount !== 0 ? ((crypto.amountUSD || 0) * 100 / totalAmount).toFixed(2) : 0,
      color: crypto.color
    }));
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: this.getDonutData(nextProps)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { id } = this.props;
    $("#donut-chart-" + id).donutpie("update", this.state.data);
  }

  componentDidMount() {
    const { id } = this.props;
    $("#donut-chart-" + id).donutpie({
      radius: "250",
      tooltip: false,
      tooltipClass: "donut-pie-tooltip-bubble"
    });
  }

  render() {
    const { id } = this.props;
    const maxI = this.state.data.length && this.state.data.findIndex(data =>
      data.hvalue == Math.max(...this.state.data.map(data => data.hvalue)));

    return (
      <div className="exchange-donut-box">
        <div id={"donut-chart-" + id} className={`exchange-donut-chart${this.state.isDonut ? "" : " hidden-xs-up"}`}>
          <div className="exchange-donut-descr">
            <p className="exchange-donut-perc">{this.state.data.length && this.state.data[maxI].hvalue}%</p>
            <p className="exchange-donut-name">{this.state.data.length && getCrypto({ symbol: this.state.data[maxI].symbol }).name}</p>
          </div>
        </div>

        {!this.state.isDonut && <ExchangeCryptoChart id="1" ref={ref => this.balanceChart = ref} />}

        <a className="btn btn-primary text-white text-small hidden-md-down" style={{ padding: "0.5rem", position: "absolute", top: 0, left: 0, zIndex: 99999999 }}
         onClick={() => this.setState({ isDonut: !this.state.isDonut })}>{this.state.isDonut ? <img style={{width: "30px"}} src="assets/images/line_chart_white.png"/> : <img style={{width: "30px"}} src="assets/images/pie_chart_white.png"/>}</a>

         <a className="btn btn-primary text-white text-small hidden-lg-up" style={{ padding: "0.5rem", position: "absolute", top: 0, left: "10px", zIndex: 99999999 }}
          onClick={() => this.setState({ isDonut: !this.state.isDonut })}>{this.state.isDonut ? <img style={{width: "30px"}} src="assets/images/line_chart_white.png"/> : <img style={{width: "30px"}} src="assets/images/pie_chart_white.png"/>}</a>

        <div className="exchange-donut-range" onWheel={() => console.log("ay")}>
          {this.state.data.map((item, i) => {
            return (
              <div key={i} className="ex-slider-item noselect" onClick={(e) => $(e.currentTarget).toggleClass('active')}>
                <div className="d-flex align-items-center">
                  <div><img src={"/assets/images/" + getCrypto({ symbol: item.symbol }).iconm} alt="" /></div>
                  <div><p className="fs10bw">{getCrypto({ symbol: item.symbol }).name}</p><p className="op6">{item.hvalue}%</p></div>
                </div>
                <div className="text-right">
                  <p className="fs10bw">{item.amount.toFixed(2)} {item.symbol}</p><p className="op6">{item.amountUSD.toFixed(0)} $</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default ExchangeDonut;

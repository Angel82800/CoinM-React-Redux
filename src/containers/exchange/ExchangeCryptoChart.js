import React, { Component } from "react";
import { connect } from "react-redux";
import { ExchangeActions } from "../../redux/app/actions";

class ExchangeCryptoChart extends Component {
  constructor(props) {
    super(props);

    this.stxx = [];
    this.timeframes = [
      { text: "5M", ms: 300000 },
      { text: "30M", ms: 1800000 },
      { text: "4H", ms: 14400000 }
    ];

    this.state = {
      timeframe: 14400000
    }
  }

  updateData = (id) => {
    this.stxx[id].updateChartData([
      { "Date": "2015-04-16 16:00", "Open": 152.13, "High": 152.19, "Low": 152.08, "Close": 152.11, "Volume": 4505569 },
      { "Date": "2015-04-17 09:30", "Open": 151.76, "High": 151.83, "Low": 151.65, "Close": 151.79, "Volume": 2799990 },
      { "Date": "2015-04-17 09:35", "Open": 151.79, "High": 151.8, "Low": 151.6, "Close": 151.75, "Volume": 1817706 }
    ]);
  };

  getBalanceOverTime = () => {
    return this.props.getBalanceOverTime({
      token: this.props.userToken,
      data: {
        timeframe: this.state.timeframe
      }
    });
  };

  componentDidMount() {
    this.exchangeChart = true

    const { id } = this.props;

    this.stxx[id] = new CIQ.ChartEngine({
      container: $$$(".chart-" + id),
      layout: { "chartType": "mountain" },
    });

    this.stxx[id].chart.yAxis.initialMarginTop = 100;

    this.stxx[id].setStyle("stx_mountain_chart", "color", "rgba(54, 65, 95, 0.5)");
    this.stxx[id].setStyle("stx_mountain_chart", "borderTopColor", "rgba(162, 137, 255, 1)");
    this.stxx[id].setStyle("stx_mountain_chart", "backgroundColor", "rgba(54, 65, 95, 0.5)");

    const potatoAndDoItAgain = () =>
      this.getBalanceOverTime().catch(() => null)
        .then(() => this.exchangeChart && setTimeout(potatoAndDoItAgain, 5000));

    potatoAndDoItAgain();
  }

  componentWillUnmount() {
    this.exchangeChart = false;
  }

  componentDidUpdate() {
    this.drawChart();
  }

  drawChart = () => {
    const { balanceOverTime, id } = this.props;

    const graphData = ((balanceOverTime || {})[this.state.timeframe] || []).map(e => ({
      "DT": e.timestamp,
      "Close": e.balance
    }));

    this.stxx[id].newChart("SPY", graphData, null, () => {
      var inputs = {
        "Period": 50,
        "Field": "Close",
        "Type": "ma"
      };

      var outputs = {
        "MA": "#fff500"
      };

      // this.stxx[id].setSpan({multiplier: 1, base: "today"});

      CIQ.Studies.addStudy(this.stxx[id], "ma", inputs, outputs);
    });
  };

  setTimeframe = (timeframe) => this.setState({ timeframe }, this.getBalanceOverTime);

  setSpan = (m, b) => {
    this.setState({ base: b });

    const { id } = this.props;
    this.stxx[id].setSpan({ multiplier: m, base: b });
  };

  render() {
    const { id } = this.props;

    return (
      <div className="exchange-charts ciq-night">
        <div id="ex-charts-range" className="exchange-charts-range">
          <div className="exchange-range-container text-center">
            {this.timeframes.map((timeframe, index) => (
              <div className={"exchange-range-but" + (this.state.timeframe.ms === timeframe.ms ? " active" : "")}
                onClick={() => this.setTimeframe(timeframe.ms)} key={index}>
                {timeframe.text}
              </div>
            ))}
          </div>
        </div>

        <div className={"chartContainer " + "chart-" + id} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.userReducer.userId,
    userToken: state.userReducer.userToken,
    balanceOverTime: state.exchangeReducer.balanceOverTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBalanceOverTime: (req) => dispatch(ExchangeActions.getBalanceOverTime(req.token, req.data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeCryptoChart);

import React, { Component } from "react";

class TradeChart extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.stxx = [];
    }

    componentDidMount() {
        const { id } = this.props;

        this.stxx[id] = new CIQ.ChartEngine({
            container: $$$(".chart-" + id + "-hist"),
            layout: { "chartType": "candle" },
            //    allowScroll: false,
            //    allowZoom: false
        });

        this.drawChart();
    }

    componentWillReceiveProps() {
        // set the renderer
        this.drawChart();
    }

    drawChart = () => {
        const { id, timeChartData } = this.props;

        if (timeChartData && timeChartData.length)
            this.stxx[id].newChart("SPY", JSON.parse(JSON.stringify(timeChartData)), null, null);
    };

    render() {
        const { id } = this.props;

        return (
            <div className={"chartContainer " + "chart-" + id + "-hist"}/>
        );
    }
}

export default TradeChart;

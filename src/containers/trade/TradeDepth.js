import React, { Component } from "react";

class TradeDepth extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.stxx = [];
    }

    componentDidMount() {
        const { id } = this.props;

        this.stxx[id] = new CIQ.ChartEngine({
            container: $$$(".chart-" + id + "-depth"),
            layout: { "chartType": "mountain" },

            allowScroll: false,
            allowZoom: false
        });
        this.stxx[id].allowScroll = false;
        this.stxx[id].allowZoom = false;

        this.stxx[id].setStyle("stx_mountain_chart", "color", "rgba(177, 124, 253, 0.00784314)");
        this.stxx[id].setStyle("stx_mountain_chart", "borderTopColor", "rgba(124, 150, 240, 1)");
        this.stxx[id].setStyle("stx_mountain_chart", "backgroundColor", "rgba(177,124,253,0.3)");

        this.stxx[id].chart.xAxis.formatter = (labelDate, gridType, timeUnit, timeUnitMultiplier) => (labelDate.valueOf() / 1e9).toFixed(2);
        this.stxx[id].chart.xAxis.idealTickSizePixels = 50;

        this.drawChart();
    }

    componentWillReceiveProps() {
        // set the renderer
        this.drawChart();
    }

    drawChart = () => {
        const { id, depthChartData } = this.props;

        console.log("drawing chart...");
        console.log(depthChartData);

        let cumBid = 0, cumAsk = 0;
        // const bidData = testData.bids.map(data => ({
        //     DT: parseFloat(data[0]) * 1e9,
        //     Close: (cumBid += parseFloat(data[1]))
        // })).reverse().slice(-100, -1);
        // const askData = testData.asks.map(data => ({
        //     DT: parseFloat(data[0]) * 1e9,
        //     Close: (cumAsk += parseFloat(data[1]))
        // })).slice(0, 100);


        if (!depthChartData || !depthChartData.bid || !depthChartData.ask)
            return;

        const bidData = Object.keys(depthChartData.bid).map(bid => parseFloat(bid)).sort((a, b) => b - a).map(bid => ({
            DT: Math.round(parseFloat(bid) * 1e9),
            Close: (cumBid += depthChartData.bid[bid])
        })).reverse();
        const askData = Object.keys(depthChartData.ask).map(ask => parseFloat(ask)).sort((a, b) => a - b).map(ask => ({
            DT: Math.round(parseFloat(ask) * 1e9),
            Close: (cumAsk += depthChartData.ask[ask])
        }));

        let masterData = JSON.parse(JSON.stringify(bidData));

        this.stxx[id].newChart("bids", masterData, null, null);

        let renderer = this.stxx[id].setSeriesRenderer(new CIQ.Renderer.Lines({ params: { name: "lines", type: "mountain" } }));
        // this.stxx[id].addSeries("bids", { data: bidData, shareYAxis: true }, () => renderer.attachSeries("bids", "#00EBFF").ready());
        this.stxx[id].addSeries("asks", { data: askData, shareYAxis: true }, () => renderer.attachSeries("asks", "#FFBE00").ready());

        this.stxx[id].chart.yAxis.max = Math.max(...bidData.map(data => data.Close), ...askData.map(data => data.Close));
        this.stxx[id].chart.yAxis.min = 0;//Math.min(...bidData.map(data => data.Close), ...askData.map(data => data.Close));
        this.stxx[id].setRange({ dtLeft: new Date(bidData[0].DT), dtRight: new Date(askData[askData.length - 1].DT) });
    };

    render() {
        const { id, height } = this.props;

        return (
            <div style={{ width: "100%", height }} className={"chartContainer " + "chart-" + id + "-depth"}/>
        );
    }
}

export default TradeDepth;

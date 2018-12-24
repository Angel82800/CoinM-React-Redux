import React, { Component } from "react";

Number.prototype.toPrecisionMy = function (p) {
    return parseFloat(this.toPrecision(p)).toFixed(10).replace(/0/g, " ").trimRight().replace(/ /g, "0").replace(/\.$/, ".0");
};

class TradeHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            histories: [
                { trade_size: 0.14011681, price: 6998.0, status: "up", time: "22:32:48" },
                { trade_size: 1.24012682, price: 6998.5, status: "up", time: "22:32:49" },
                { trade_size: 0.54015685, price: 6997.5, status: "up", time: "22:32:50" },
                { trade_size: 0.84018688, price: 6996.0, status: "up", time: "22:32:51" },
                { trade_size: 0.34013683, price: 6995.5, status: "up", time: "22:32:52" },
                { trade_size: 9.14011681, price: 6994.0, status: "up", time: "22:32:53" },
                { trade_size: 0.94019689, price: 6993.5, status: "down", time: "22:32:54" },
                { trade_size: 0.44014684, price: 6992.0, status: "up", time: "22:32:55" },
                { trade_size: 0.94019689, price: 6991.5, status: "up", time: "22:32:56" },
                { trade_size: 9.34013683, price: 6988.5, status: "down", time: "22:32:57" },
                { trade_size: 0.94019689, price: 6988.0, status: "down", time: "22:32:58" },
                { trade_size: 0.34013683, price: 6987.5, status: "up", time: "22:32:59" },
                { trade_size: 8.74017687, price: 6987.0, status: "up", time: "22:33:00" },
                { trade_size: 0.44014684, price: 6986.5, status: "up", time: "22:33:01" },
                { trade_size: 0.64016686, price: 6985.0, status: "up", time: "22:33:02" },
                { trade_size: 6.24012682, price: 6984.0, status: "up", time: "22:33:03" },
                { trade_size: 0.34013683, price: 6982.0, status: "down", time: "22:33:04" },
                { trade_size: 3.54015685, price: 6981.5, status: "down", time: "22:33:05" },
                { trade_size: 0.14011681, price: 6998.0, status: "up", time: "22:33:06" },
                { trade_size: 1.24012682, price: 6998.5, status: "up", time: "22:33:07" },
                { trade_size: 0.54015685, price: 6997.5, status: "up", time: "22:33:08" },
                { trade_size: 0.84018688, price: 6996.0, status: "down", time: "22:33:09" },
                { trade_size: 0.34013683, price: 6995.5, status: "up", time: "22:33:10" },
                { trade_size: 9.14011681, price: 6994.0, status: "up", time: "22:33:11" },
                { trade_size: 0.94019689, price: 6993.5, status: "up", time: "22:33:12" },
                { trade_size: 0.44014684, price: 6992.0, status: "up", time: "22:33:13" },
                { trade_size: 0.94019689, price: 6991.5, status: "down", time: "22:33:14" },
                { trade_size: 9.34013683, price: 6988.5, status: "down", time: "22:33:15" },
                { trade_size: 0.94019689, price: 6988.0, status: "down", time: "22:33:16" },
                { trade_size: 0.34013683, price: 6987.5, status: "down", time: "22:33:17" },
                { trade_size: 8.74017687, price: 6987.0, status: "up", time: "22:33:18" },
                { trade_size: 0.44014684, price: 6986.5, status: "up", time: "22:33:19" },
                { trade_size: 0.64016686, price: 6985.0, status: "down", time: "22:33:20" },
                { trade_size: 6.24012682, price: 6984.0, status: "up", time: "22:33:21" },
                { trade_size: 0.34013683, price: 6982.0, status: "up", time: "22:33:22" },
                { trade_size: 3.54015685, price: 6981.5, status: "down", time: "22:33:23" },
            ]
        };
    }

    componentDidMount() {

    }

    render() {
        const { histories } = this.state;
        const { tradeHistory } = this.props;
        tradeHistory.forEach((history, i) => {
            if (!i)
                history.status = "flat";
            else if (history.price > tradeHistory[i - 1].price)
                history.status = "up";
            else if (history.price < tradeHistory[i - 1].price)
                history.status = "down";
            else
                history.status = "flat";
        });

        const statusToColor = status => {
            switch (status) {
                case "up":
                    return "green";
                case "down":
                    return "red";
                case "flat":
                    return "white";
            }
        };

        return (
            <div className="trade-history">
                <div className="trade-history-header text-uppercase">
                    Trade History
                </div>

                <div className="trade-history-body">
                    <table className="table trade-history-table">
                        <thead>
                        <tr>
                            <th width="20"/>
                            <th>Trade Size</th>
                            <th>Price (USD)</th>
                            <th>Time</th>
                        </tr>
                        </thead>

                        <tbody>
                        {tradeHistory.map((history, index) => (
                            <tr className={history.status} key={index}>
                                <td/>
                                <td>{history.qty.toPrecisionMy(6)}</td>
                                <td>{history.price.toPrecisionMy(6)} <i className={"fa fa-arrow-" + history.status} aria-hidden="true"/></td>
                                <td>{new Date(history.timestamp).toISOString().split("T")[1].slice(0, -1)}</td>
                            </tr>
                        )).reverse()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default TradeHistory;

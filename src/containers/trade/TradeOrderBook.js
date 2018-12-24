import React, { Component } from "react";

Number.prototype.toPrecisionMy = function (p) {
    return parseFloat(this.toPrecision(p)).toFixed(10).replace(/0/g, " ").trimRight().replace(/ /g, "0").replace(/\.$/, ".0");
};

class TradeOrderBook extends Component {
    render() {
        const { bookData } = this.props;

        return (
            <div className="trade-order-book">
                <div className="order-book-header text-uppercase">
                    Order Book
                </div>

                <div className="order-book-body">
                    <div className="order-book-table">
                        <table className="table sell-order-table">
                            <tbody>
                            {Object.keys(bookData.ask).map(ask => parseFloat(ask)).sort((a, b) => b - a).map((ask, index) => (
                                <tr key={index}>
                                    <td>
                                        <span style={{ width: Math.min(50, Math.max(bookData.ask[ask], 1)) }}/>
                                    </td>
                                    <td>{bookData.ask[ask].toPrecisionMy(6)}</td>
                                    <td>{parseFloat(ask).toPrecisionMy(6)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="order-book-middle">
                        <div className="d-flex justify-content-between pl-3 pr-5">
                            <div>USD SPREAD</div>
                            <div>{(Math.min(...Object.keys(bookData.ask).map(ask => parseFloat(ask))) - Math.max(...Object.keys(bookData.bid).map(bid => parseFloat(bid)))).toPrecision(6)}</div>
                        </div>
                    </div>

                    <div className="order-book-table">
                        <table className="table buy-order-table">
                            <thead>
                            <tr>
                                <th width="20"/>
                                <th>Market size</th>
                                <th>Price</th>
                            </tr>
                            </thead>

                            <tbody>
                            {Object.keys(bookData.bid).map(bid => parseFloat(bid)).sort((a, b) => b - a).map((bid, index) => (
                                <tr key={index}>
                                    <td>
                                        <span style={{ width: Math.min(50, Math.max(bookData.bid[bid], 1)) }}/>
                                    </td>
                                    <td>{bookData.bid[bid].toPrecisionMy(6)}</td>
                                    <td>{parseFloat(bid).toPrecisionMy(6)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default TradeOrderBook;

import React, { Component } from "react";

class TradeOrderBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: "active"
        };
    }

    changeTable = table => () => this.setState({ table });

    render() {
        const { table } = this.state;
        const { height, openOrders, orderHistory, fills } = this.props;

        return (
            <div className="trade-open-orders" style={{ height }}>
                <div className="open-orders-header text-uppercase">
                    {(() => {
                        switch (this.state.table) {
                            case "active":
                                return "Active Orders";
                            case "history":
                                return "Order History";
                            case "fills":
                                return "Fills";
                        }
                    })()}

                    <span className={`pull-right order-nav ${table === "fills" ? "active" : ""}`} onClick={this.changeTable("fills")}>Fills</span>
                    <span className={`pull-right order-nav ${table === "history" ? "active" : ""}`} onClick={this.changeTable("history")}>Order History</span>
                    <span className={`pull-right order-nav ${table === "active" ? "active" : ""}`} onClick={this.changeTable("active")}>Active Orders</span>
                </div>

                <div className="open-orders-body">
                    {!(table === "fills") && (
                        <table className="table open-orders-table orders-table">
                            <thead>
                            <tr>
                                <th width="20"/>
                                <th>Bought Qty</th>
                                <th>Buying Currency</th>
                                <th>Completed</th>
                                <th>Created</th>
                                <th>Order Type</th>
                                <th>Orig Buying Qty</th>
                                <th>Orig Selling Qty</th>
                                <th>Selling Currency</th>
                                <th>Seq Number</th>
                                <th>Sold Qty</th>
                            </tr>
                            </thead>

                            <tbody>
                            {((table == "active" ? openOrders : orderHistory) || []).map((order, index) => (
                                <tr key={index}>
                                    <td></td>
                                    <td>{order.boughtQty}</td>
                                    <td>{order.buyingCurrency}</td>
                                    <td>{order.completionTime}</td>
                                    <td>{order.creationTime}</td>
                                    <td>{order.orderType}</td>
                                    <td>{order.buyingQty}</td>
                                    <td>{order.sellingQty}</td>
                                    <td>{order.sellingCurrency}</td>
                                    <td>{order.seqNumber}</td>
                                    <td>{order.soldQty}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        )
    }
}

export default TradeOrderBook;

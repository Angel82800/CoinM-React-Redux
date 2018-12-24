import React, { Component } from "react";
import { connect } from "react-redux";

import TradePair from "./TradePair";
import TradeOpenOrders from "./TradeOpenOrders";
import { TradeActions, PurchaseActions, ExchangeActions } from "../../redux/app/actions";

class TradeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            charts: [
                { id: 1, data: "" },
                //      {id: 2, data: ""},
                //      {id: 3, data: ""},
                //      {id: 4, data: ""},
            ],
            openOrders: []
        };
    }

    componentDidMount() {
        this.tradePage = true;

        this.props.getWallets({
            token: this.props.userToken
        });

        const getData = () => Promise.all([
            this.props.getOpenOrders({
                token: this.props.userToken
            }),
            this.props.getOrderHistory({
                token: this.props.userToken
            }),
        ]).catch(() => null).then(() => this.tradePage && setTimeout(getData, 500));

        getData();
    }

    componentWillUnmount() {
        this.tradePage = false;
    }

    sendOrder = order =>
        this.props.sendOrder({
            token: this.props.userToken,
            order
        }).then(() => this.props.getWallets({
            token: this.props.userToken
        })).catch(err => console.log("failz" + err))

    render() {
        const windowHeight = window.innerHeight;
        const lowerHeight = Math.max(parseInt(windowHeight * 0.15), 200);
        const upperHeight = windowHeight - lowerHeight;
        const pairCount = this.state.charts.length;
        const pairHeight = pairCount * 400 > upperHeight ? 400 : upperHeight / pairCount;

        return (
            <div className="d-flex flex-column">
                <div style={{ height: upperHeight, overflowX: "auto" }}>
                    {this.state.charts.map((item, i) => (
                        <TradePair wallets={this.props.wallets} sendOrder={this.sendOrder} item={item} key={i} height={pairHeight}/>
                    ))}
                </div>

                <TradeOpenOrders
                    height={lowerHeight}
                    openOrders={this.props.openOrders || []}
                    orderHistory={this.props.orderHistory || []}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userToken: state.userReducer.userToken,
        openOrders: state.tradeReducer.openOrders,
        orderHistory: state.tradeReducer.orderHistory,
        fills: state.tradeReducer.fills,
        wallets: state.purchaseReducer.wallets
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getWallets: (req) => dispatch(PurchaseActions.getWallets(req.token)),
        getOpenOrders: (req) => dispatch(TradeActions.getOpenOrders(req.token)),
        getOrderHistory: (req) => dispatch(TradeActions.getOrderHistory(req.token)),
        sendOrder: (req) => dispatch(ExchangeActions.sendOrder(req.token, req.order))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TradeView);

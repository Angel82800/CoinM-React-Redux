import React, { Component } from "react";
import { connect } from "react-redux";

import TradeChart from "./TradeChart";
import TradeDeal from "./TradeDeal";
import TradeOrderBook from "./TradeOrderBook";
import TradeNavigation from "./TradeNavigation";
import TradeHistory from "./TradeHistory";
import TradeDepth from "./TradeDepth";
import { ExchangeActions, TradeActions } from "../../redux/app/actions";

const getLast = array => (array && array.length && array[array.length - 1]) || {};

class TradePair extends Component {
    constructor(props) {
        super(props);

        this.state = {
            book: false,
            chart: false,
            buycur: "BTC",
            sellcur: "USD",
            timeframe: 300000
        };

        this.timeframes = [
            { text: "5M", ms: 300000 },
            { text: "30M", ms: 1800000 },
            { text: "4H", ms: 14400000 }
        ];
    }

    /*
    initData = pair => Promise.all([
        this.props.getTradeHistory({
            data: {
                pair,
            },
            token: this.props.userToken
        }),
        this.props.getBook({
            data: {
                pair,
            },
            token: this.props.userToken
        }),
        this.props.getCandleHistory({
            token: this.props.userToken,
            data: {
                pair,
                timeframe: 300000,
                force: true
            }
        })
    ]);
    */

    getData = (pair, timeframe) => Promise.all([
        this.props.getTradeHistory({
            data: {
                pair,
                from: (getLast(this.props.tradeHistory || []).timestamp || 0) + 1
            },
            token: this.props.userToken
        }),
        this.props.getBook({
            data: {
                pair,
            },
            token: this.props.userToken
        }),
        // this.props.getBookUpdates({
        //    data: {
        //        pair,
        //        from: (this.props.bookData || {}).seqNumber
        //    },
        //    token: this.props.userToken
        // }),
        this.props.getCandleHistory({
            token: this.props.userToken,
            data: {
                pair,
                timeframe,
                from: (getLast(((this.props.timeChartData || {})[pair] || {})[timeframe] || []).DT || 0) + 1
            }
        })
    ]);

    componentDidMount() {
        this.tradePair = true;

        const dataHarvest = () => this.getData(this.state.buycur + this.state.sellcur, this.state.timeframe)
            .catch(err => console.log(err))
            .then(() => this.tradePair && setTimeout(dataHarvest, 500));

        dataHarvest();
    }

    componentWillUnmount() {
        this.tradePair = false;
    }

    changeStatus = (section) => {
        switch (section) {
            case "book":
                return this.setState({
                    book: !this.state.book,
                    depth: false
                });
            case "depth":
                return this.setState({
                    book: false,
                    depth: !this.state.depth
                });
            case "trades":
                return this.setState({
                    trades: !this.state.trades
                });
        }
    };

    changeSymbol = (side) => (newSymbol) => this.setState({
        [side]: newSymbol
    });

    setTimeframe = (timeframe) => this.setState({ timeframe });

    render() {
        const { item, height } = this.props;

        return (
            <div className="container-fluid trade-section">
                <div className="row trade-row m-0">
                    <div className="col-xl-3 col-sm-6 buy-section" style={{ height }}>
                        <TradeDeal buycur={this.state.buycur} sellcur={this.state.sellcur}
                                   bookData={this.props.bookData} wallets={this.props.wallets} price={(getLast(this.props.tradeHistory) || {}).price}
                                   changeSymbol={this.changeSymbol} sendOrder={this.props.sendOrder}/>
                        <TradeNavigation state={this.state} changeStatus={this.changeStatus}/>
                    </div>

                    {/*<div className="col-sm-6 p-0 history-section d-xl-none" style={{height: height}}>
                        <TradeHistory tradeHistory={this.props.tradeHistory}/>
                    </div>*/}

                    <div className="col-xl-9 col-sm-12 p-0">
                        <div className="d-sm-flex">
                            {this.state.trades && (
                                <div className="history-section d-none d-xl-block" style={{ height: height }}>
                                    <TradeHistory tradeHistory={this.props.tradeHistory}/>
                                </div>
                            )}

                            <div className="flex-1 charts-section ciq-night" style={{ height: height }}>
                                <div className="d-flex exchange-charts-range text-left" style={{ background: "none" }}>
                                    <div className="exchange-range-container h-25 w-25 text-center ml-0">
                                        {this.timeframes.map((timeframe, index) => (
                                            <div className={"exchange-range-but " + (this.state.timeframe === timeframe.ms ? " active" : "")}
                                                 onClick={() => this.setTimeframe(timeframe.ms)} key={index}>
                                                {timeframe.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <TradeChart id={item.id} timeChartData={((this.props.timeChartData || {})[this.state.buycur + this.state.sellcur] || {})[this.state.timeframe]}/>
                            </div>

                            {this.state.depth && (
                                <div className="flex-1 charts-section ciq-night" style={{ height: height }}>
                                    <TradeDepth id={item.id} data={item.data} depthChartData={this.props.bookData}/>
                                </div>
                            )}

                            {this.state.book && (
                                <div className="order-book-section" style={{ height: height }}>
                                    <TradeOrderBook bookData={this.props.bookData}/>
                                </div>
                            )}
                        </div>
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
        openOrders: state.tradeReducer.openOrders,
        tradeHistory: state.tradeReducer.tradeHistory,
        bookData: state.tradeReducer.bookData,
        timeChartData: state.exchangeReducer.candleHistory,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getTradeHistory: (req) => dispatch(TradeActions.getTradeHistory(req.data, req.token)),
        getBook: (req) => dispatch(TradeActions.getBook(req.data, req.token)),
        getBookUpdates: (req) => dispatch(TradeActions.getBookUpdates(req.data, req.token)),
        getCandleHistory: (req) => dispatch(ExchangeActions.getCandleHistory(req.data, req.token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TradePair);

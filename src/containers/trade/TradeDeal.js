import React, { Component } from "react";

import { Carousel } from "../../components/Common/Carousel";

Number.prototype.toPrecisionMy = function (p) {
    return parseFloat(this.toPrecision(p)).toFixed(10).replace(/0/g, " ").trimRight().replace(/ /g, "0").replace(/\.$/, ".0");
};

class TradeDeal extends Component {
    fiat = ["USD", "EUR"];

    allowedPairs = [
        "BTCUSD",
        "BTCXCM",
        "BTCEUR",
        "ETHBTC",
        "ETHUSD",
        "ETHEUR"
    ];

    currencies = [
        "BTC",
        "USD",
        "XRP",
        "ETH",
        "XCM",
        "LTC"
    ];

    constructor(props) {
        super(props);

        this.state = {
            buy: 0,
            sell: 0,
            orderType: "market",
            stoplimit: 0
        };
    }

    componentDidMount() {
        const { id } = this.props;
    };

    /*
    handleIncrease = (event) => {
        const { askvalue, bidvalue } = this.state;
        let cl = event.target.getAttribute("data");

        if (cl === "crypto") {
            this.setState({ askvalue: askvalue + this.getIncrement(askvalue) });
        } else {
            this.setState({ bidvalue: bidvalue + this.getIncrement(bidvalue) });
        }
    };

    handleDecrease = (event) => {
        const { askvalue, bidvalue } = this.state;
        const { id } = this.props;
        let cl = event.target.getAttribute("data");

        if (cl === "crypto") {
            let a = this.getIncrement(askvalue);
            this.setState({ askvalue: askvalue - a });
        } else {
            let b = this.getIncrement(bidvalue);
            this.setState({ bidvalue: bidvalue - b });
        }
    };

    getIncrement = (number) => {
        let res = number.toString().split(".");
        let str = "0.";
        for (let i = 0; i < res[1].length - 1; i++) {
            str = str + "0";
        }
        str = str + "1";

        return Number(str);
    };
    */

    handleIncrease = (event) => null;
    handleDecrease = (event) => null;
    getIncrement = (number) => null;

    symbolChange = (side) => (newSymbol) => {
        this.isDragging = false;
        const { buycur, sellcur } = this.props;
        const symbols = { buycur, sellcur };
        symbols[side] = newSymbol;
        if (this.allowedPairs.indexOf(symbols.buycur + symbols.sellcur) >= 0)
            return this.setState({ buy: 0, sell: 0 }, () =>
                this.props.changeSymbol(side)(newSymbol)
            ) || true;
        else if (this.allowedPairs.indexOf(symbols.sellcur + symbols.buycur) >= 0)
            return this.setState({ buy: 0, sell: 0 }, () => {
                this.props.changeSymbol("buycur")(symbols["sellcur"]);
                this.props.changeSymbol("sellcur")(symbols["buycur"]);
            }) || true;
        else
            return false;

    };

    shouldComponentUpdate() {
        return !this.isDragging;
    }

    onDrag = () => this.isDragging = true;

    handleChangeValue = (side) => (event) => {
        if (!event.target.value)
            return this.setState({ bidvalue: 0, askvalue: 0 });
        const noComma = event.target.value.replace(/,/g, ".");
        const floatVal = parseFloat(noComma);
        if (!!floatVal && floatVal !== 0 && !/.*\..*\..*/.test(noComma)) {
            let trailingZeros = new RegExp(floatVal + "(\.0*)$").exec(noComma);
            trailingZeros = (trailingZeros && trailingZeros[1]) || "";
            this.setState({ [side]: parseFloat(noComma) + trailingZeros }, () => {
                if (this.props.price) {
                    this.setState({
                        [side == "sell" ? "buy" : "sell"]: (this.state[side] * Math.pow(this.props.price, side == "buy" ? 1 : -1)).toPrecisionMy(6)
                    });
                }
            });
        }
    };

    handleChangeStopLimit = (event) => {
        if (!event.target.value)
            return this.setState({ stoplimit: this.props.price });
        const noComma = event.target.value.replace(/,/g, ".");
        const floatVal = parseFloat(noComma);
        if (!!floatVal && floatVal !== 0 && !/.*\..*\..*/.test(noComma)) {
            let trailingZeros = new RegExp(floatVal + "(\.0*)$").exec(noComma);
            trailingZeros = (trailingZeros && trailingZeros[1]) || "";
            this.setState({ stoplimit: parseFloat(noComma) + trailingZeros });
        }
    };

    changeType = (orderType) => () => this.setState({ orderType, stoplimit: this.props.price });

    render() {
        const { id } = this.props;
        const { sellcur, buycur } = this.props;
        const { sell, buy, orderType, stoplimit } = this.state;
        const havebuy = (((this.props.wallets || []).find(w => w.currency == buycur) || {}).balance || 0).toPrecisionMy(6);
        const havesell = (((this.props.wallets || []).find(w => w.currency == sellcur) || {}).balance || 0).toPrecisionMy(6);
        const askvalue = Math.min(...Object.keys((this.props.bookData || {}).ask || {}).map(ask => parseFloat(ask)));
        const bidvalue = Math.max(...Object.keys((this.props.bookData || {}).bid || {}).map(bid => parseFloat(bid)));

        return (
            <div className="d-flex flex-column deal-container h-100 align-items-center justify-content-center">
                <div className="d-flex deal-container h-50 align-items-center" id={id}>
                    <div className="crypto">
                        <div className="value">
                            You have <strong>{havebuy} {buycur}</strong>
                        </div>

                        <Carousel className="ask" onChanged={this.symbolChange("buycur")} onDrag={this.onDrag}
                                  items={this.currencies} selectedItem={buycur}/>

                        <div className="deal noselect purple" onClick={() => {
                            console.log("sending order");
                            this.props.sendOrder({
                                orderType,
                                "buyingCurrency": buycur,
                                "buyingQty": orderType == "market" ? 1e10 : parseFloat(sell) / stoplimit,
                                "sellingCurrency": sellcur,
                                "sellingQty": parseFloat(sell)
                            });
                        }}>
                            <div className="action">
                                <i className="fa fa-refresh" aria-hidden="true"/> <span>Buy</span>
                            </div>

                            <div className="price">
                                <span>{askvalue}</span><strong>ASK</strong>
                            </div>
                        </div>

                        <div className="ba">
                            ask <i className="fa fa-caret-right" aria-hidden="true"/>
                        </div>

                        <div className="input">
                            <input type="text" name="ask" value={buy} onChange={this.handleChangeValue("buy")}/>
                            <div className="int">
                                <span>{buycur}</span>
                                {/*<i className="fa fa-caret-up" aria-hidden="true" data="crypto" onClick={this.handleIncrease}/>*/}
                                {/*<i className="fa fa-caret-down" aria-hidden="true" data="crypto" onClick={this.handleDecrease}/>*/}
                            </div>
                        </div>
                    </div>

                    <div className="change">
                        {/*<i className="fa fa-refresh" aria-hidden="true"/>*/}
                    </div>

                    <div className="fiat">
                        <div className="value">
                            You have <strong>{havesell} {sellcur}</strong>
                        </div>

                        <Carousel className="bid" onChanged={this.symbolChange("sellcur")} onDrag={this.onDrag}
                                  items={this.currencies} selectedItem={sellcur}/>


                        <div className="deal noselect blue" onClick={() => {
                            this.props.sendOrder({
                                orderType,
                                "buyingCurrency": sellcur,
                                "buyingQty": orderType == "market" ? 1e10 : parseFloat(buy) * stoplimit,
                                "sellingCurrency": buycur,
                                "sellingQty": parseFloat(buy)
                            });
                        }}>
                            <div className="action">
                                <i className="fa fa-shopping-cart" aria-hidden="true"/><span>Sell</span>
                            </div>

                            <div className="price">
                                <span>{bidvalue}</span><strong>BID</strong>
                            </div>
                        </div>

                        <div className="ba">
                            BID <i className="fa fa-caret-right" aria-hidden="true"/>
                        </div>

                        <div className="input">
                            <input type="text" name="bid" value={sell} onChange={this.handleChangeValue("sell")}/>
                            <div className="int">
                                <span>{sellcur}</span>
                                {/*<i className="fa fa-caret-up" aria-hidden="true" data="fiat" onClick={this.handleIncrease}/>*/}
                                {/*<i className="fa fa-caret-down" aria-hidden="true" data="fiat" onClick={this.handleDecrease}/>*/}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column advanced-orders-type-changer">
                    <div className="d-flex order-type-changer">
                        <span className={`order-type-option ${orderType === "limit" ? "active" : ""}`} onClick={this.changeType("limit")}>LIMIT</span>
                        <span className={`order-type-option ${orderType === "market" ? "active" : ""}`} onClick={this.changeType("market")}>MARKET</span>
                        <span className={`order-type-option ${orderType === "stop" ? "active" : ""}`} onClick={this.changeType("stop")}>STOP</span>
                    </div>

                    <div className={"d-flex stop-limit-price " + (orderType == "market" ? "hidden-xs-up" : "")}>
                        <div className="ba" style={{ margin: "10px 10px 0px 0px" }}>
                            {orderType.toUpperCase()} PRICE <i className="fa fa-caret-right" aria-hidden="true"/>
                        </div>

                        <div className="input" style={{ margin: "0px 0px 0px 10px" }}>
                            <input type="text" name="stoplimit" value={stoplimit} onChange={this.handleChangeStopLimit}/>
                            <div className="int">
                                <span>{buycur}/{sellcur}</span>
                                {/*<i className="fa fa-caret-up" aria-hidden="true" data="fiat" onClick={this.handleIncrease}/>*/}
                                {/*<i className="fa fa-caret-down" aria-hidden="true" data="fiat" onClick={this.handleDecrease}/>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TradeDeal;

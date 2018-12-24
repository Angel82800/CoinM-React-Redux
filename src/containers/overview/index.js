import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import OwlCarousel from "react-owl-carousel";
import Axios from "axios";

import { PurchaseActions, ExchangeActions, AccountActions } from "../../redux/app/actions";

const walletValues = [
    {
        value: "day",
        text: "1D"
    },
    {
        value: "month",
        text: "1M"
    },
    {
        value: "year",
        text: "1Y"
    }
];

const charts = [
    { crt: "BTC", name: "Bitcoin", icon: "go-coin-btc.svg" },
    { crt: "ETH", name: "Ethereum", icon: "go-coin-eth.svg" },
    { crt: "LTC", name: "Litecoin", icon: "go-coin-ltc.svg" },
    { crt: "BCH", name: "Bitcoin cash", icon: "go-coin-bch.svg" },
    { crt: "XRP", name: "Ripple", icon: "go-coin.svg" }
];

const donutData = [
    {
        symbol: "XCM",
        hvalue: 30,
        color: "#fcdb19"
    },
    {
        symbol: "XCM*",
        hvalue: 70,
        color: "#47bed0"
    }
];

class Overview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            communityToggle: false,
            communityChat: false,
            symbol: "BTC",
            loading: true,
            walletValue: "year",
            stxxW: null,
            chartData: {
                "BTC": { loaded: false, sort: "up", amount: "$00,00.00", incr: "00,00%", crtAmount: "0,0000000", crypto: "BTC" },
                "ETH": { loaded: false, sort: "up", amount: "$00,00.00", incr: "00,00%", crtAmount: "0,0000000", crypto: "BTC" },
                "LTC": { loaded: false, sort: "up", amount: "$00,00.00", incr: "00,00%", crtAmount: "0,0000000", crypto: "BTC" },
                "BCH": { loaded: false, sort: "up", amount: "$00,00.00", incr: "00,00%", crtAmount: "0,0000000", crypto: "BTC" },
                "XRP": { loaded: false, sort: "up", amount: "$00,00.00", incr: "00,00%", crtAmount: "0,0000000", crypto: "BTC" },
            },
        };
    }

    componentDidMount() {
        this.drawChart("BTC");
        this.drawCharts();
        this.drawDonut();
        this.props.getWallets({
            token: this.props.userToken
        });

        this.props.getUserReferral({
            userId: this.props.userId,
            token: this.props.userToken
        });

        this.props.getBalances({
            token: this.props.userToken
        });

        Axios.get(process.env.REACT_APP_API_URI + "feed/blog")
            .then(response => this.setState({ blogfeed: response.data.data }));
        Axios.get(process.env.REACT_APP_API_URI + "feed/medium")
            .then(response => this.setState({ mediumfeed: response.data.data }));
    }

    componentDidUpdate() {
        if (!!this.owlNewsCarousel) {
            this.owlNewsCarousel.componentDidUpdate = function () {
                this.owlCarousel.owlCarousel(this.options);
            };
        }

        if (!!this.owlMediumCarousel) {
            this.owlMediumCarousel.componentDidUpdate = function () {
                this.owlCarousel.owlCarousel(this.options);
            }
        }
    }

    drawDonut = () => {
        $(".go-wallet-donut-2").donutpie({
            radius: 130,
            tooltip: false,
            tooltipClass: "donut-pie-tooltip-bubble"
        });

        $(".go-wallet-donut-2").donutpie("update", donutData);


        $(".go-wallet-donut-3").donutpie({
            radius: 80,
            tooltip: false,
            tooltipClass: "donut-pie-tooltip-bubble"
        });

        $(".go-wallet-donut-3").donutpie("update", donutData);
    };

    drawCharts = () => {
        // Solves promises in sequence
        const promiseSerial = funcs =>
            funcs.reduce((promise, func) =>
                    promise.then(result => func().then(Array.prototype.concat.bind(result))),
                Promise.resolve([]));

        promiseSerial(charts.map((element, index) =>
            (() => this.drawChartRow(element.crt, index))));
    };

    drawChartRow = (crt, id) => {
        let stxx;

        const timeframe = 14400000;
        const fiatC = "USD";

        return this.props.getCandleHistory({
            token: this.props.userToken,
            data: {
                pair: crt.toUpperCase() + fiatC.toUpperCase(),
                timeframe
            }
        }).then(() => {
            const data = JSON.parse(JSON.stringify(this.props.candleHistory[crt.toUpperCase() + fiatC.toUpperCase()][timeframe]));

            stxx = new CIQ.ChartEngine({
                container: $$$("#c" + id + " .go-chart-row-chart"),
                layout: { "chartType": "mountain" },
                allowZoom: false,
                allowScroll: false
            });

            // stxx.chart.yAxis.initialMarginTop = 100;
            // stxx.chart.xAxis.displayGridLines = false;
            // stxx.chart.yAxis.displayGridLines = false;

            stxx.setStyle("stx_watermark", "color", "fff");
            stxx.setStyle("stx_mountain_chart", "color", "rgba(159, 137, 200, 0.5)");
            stxx.setStyle("stx_mountain_chart", "borderTopColor", "rgba(159, 137, 200, 0.5)");
            stxx.setStyle("stx_mountain_chart", "backgroundColor", "rgba(159, 137, 200, 0.5)");

            stxx.newChart(crt, data, null, function () {
                // stxx.setSpan({ multiplier: 1, span: "month" });
                //  stxx.draw();
            }, { span: { multiplier: 30, base: "day" } });

            this.calculate(crt, id);
            return this.calculateBTC(crt, id);
        });
    };

    calculate = (crt, id) => {
        const timeframe = 14400000;
        const from = Math.floor(new Date(new Date().getTime() - (168 * 60 * 60 * 1000)).getTime() / 1000);
        const period = timeframe + "/" + from;
        const fiat = "$";
        const fiatC = "USD";
        const { chartData } = this.state;

        const data = this.props.candleHistory[crt.toUpperCase() + fiatC.toUpperCase()][timeframe];
        if (data && data.length > 0) {
            let last = data[data.length - 1];
            let incr = (last.Close - last.Open) / (last.Close / 100);

            chartData[crt].amount = fiat + last.Close.toFixed(2);

            if (incr < 0) {
                chartData[crt].sort = "down";
                chartData[crt].incr = incr.toFixed(3) + " %";
            } else {
                chartData[crt].incr = "+" + incr.toFixed(3) + " %";
            }
            chartData[crt].loaded = true;

            this.setState({
                chartData
            });
        }
    };

    calculateBTC = (crt, id) => {
        const timeframe = 14400000;
        const from = Math.floor(new Date(new Date().getTime() - (168 * 60 * 60 * 1000)).getTime() / 1000);
        const period = timeframe + "/" + from;
        const crtC = "BTC";
        const { chartData } = this.state;

        return this.props.getCandleHistory({
            token: this.props.userToken,
            data: {
                pair: crt.toUpperCase() + crtC.toUpperCase(),
                timeframe,
                from: Date.now()
            }
        }).then(() => {
            const data = this.props.candleHistory[crt.toUpperCase() + crtC.toUpperCase()][timeframe];

            if (data && data.length > 0) {
                let last = data[data.length - 1];
                if (typeof last !== "undefined") {
                    chartData[crt].crtAmount = last.Close.toFixed(9);
                } else {
                    chartData[crt].crtAmount = 1;
                }
                chartData[crt].crypto = crtC;
            }
            if (crt == "BTC")
                chartData[crt].crtAmount = 1;
        });
    };

    drawChart = (symbol) => {
        const timeFrame = 86400000;

        let stxxW = null;
        $(".go-wallet-chart").html("");

        this.props.getBalanceOverTime({
            token: this.props.userToken,
            data: {
                timeframe: timeFrame
            }
        }).then(() => {
            const data = this.props.balanceOverTime[86400000];

            let reformattedData = data.map(c => ({
                "DT": new Date(c.timestamp),
                "Close": c.balance
            }));

            stxxW = new CIQ.ChartEngine({
                container: $$$(".go-wallet-chart"),
                layout: { "chartType": "mountain" },
            });

            this.setState({
                stxxW,
                loading: false,
            });

            stxxW.chart.yAxis.initialMarginTop = 100;
            stxxW.chart.xAxis.displayGridLines = false;
            stxxW.chart.yAxis.displayGridLines = false;
            // stxxW.chart.yAxis.noDraw = true;
            // stxxW.chart.xAxis.noDraw = true;

            stxxW.setStyle("stx_watermark", "color", "fff");
            stxxW.setStyle("stx_mountain_chart", "color", "rgba(252, 219, 5, 0.5)");
            stxxW.setStyle("stx_mountain_chart", "borderTopColor", "rgba(252, 219, 5, 0.5)");
            stxxW.setStyle("stx_mountain_chart", "backgroundColor", "rgba(252, 219, 5, 0.5)");

            stxxW.newChart("SPY", reformattedData, null, function () {
                stxxW.setSpan({ multiplier: 3, span: "month" });
                // CIQ.Studies.addStudy(stxxW, "ma", inputs, outputs);
                // CIQ.Tooltip({ stx: stxxW, ohl: true, volume: true, series: true, studies: true });
            });
        });
    };

    toggleCommunity = () => {
        this.setState({
            communityToggle: !this.state.communityToggle
        });
    };

    changeSymbol = (symbol) => {
        this.setState({
            loading: false
        });
        // this.drawChart(symbol);
    };

    handleWalletValueClick = (wallet) => {
        const { stxxW } = this.state;
        this.setState({
            walletValue: wallet.value
        });

        if (wallet.value === "year") {
            stxxW.setSpan({ multiplier: 3, span: "month" });
        } else {
            stxxW.setSpan({ multiplier: 1, span: wallet.value });
        }
    };

    render() {
        const communityClass = (this.state.communityToggle ? " minimized" : "") + (this.state.communityChat ? " chat" : "");
        const { chartData } = this.state;
        const { userData } = this.props;

        return (
            <div className={"row go-content-row d-flex align-items-stretch" + (this.state.communityToggle ? " go-50" : "")}>
                <div className="col-xl-3 col-lg-6 col-md-12 order-xl-1 order-2 go-charts-container pl-2 pr-2">
                    <div className="go-charts">
                        {charts.map((chart, index) => (
                            <div id={`c${index}`} className="go-chart-row" key={`c${index}`}>
                                <div className={`go-chart-row-loader ${chartData[chart.crt].loaded ? "d-none" : ""}`}><i className="far fa-spinner-third spin3s"/></div>
                                <div className="go-chart-row-icon"><img src={`assets/img/${chart.icon}`} alt=""/></div>
                                <p className="go-chart-row-title">{chart.name}</p>
                                <p className="go-chart-row-line-1">
                                    <span className="go-chart-row-amount">{chartData[chart.crt].amount}</span> <span
                                    className="go-chart-row-perc">USD <span className="go-dot">•</span> <span
                                    className="go-pairs-incr">{chartData[chart.crt].incr}</span></span> <i className={`fas fa-sort-${chartData[chart.crt].sort}`}/>
                                </p>
                                <p className="go-chart-row-line-2">
                                    <span className="go-chart-row-crt-amount">{chartData[chart.crt].crtAmount}</span><span className="go-crypto">{chartData[chart.crt].crypto}</span>
                                </p>
                                <div className="go-chart-row-chart"/>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-xl-5 col-lg-6 col-md-12 order-xl-2 order-1 go-wallet-container">
                    <div className="go-wallet">
                        <p className="go-wallet-title">Wallet</p>

                        <div className="go-wallet-balance d-flex align-items-center">
                            <img src="assets/img/go-coin.svg" alt=""/>
                            <span>Balance</span>
                        </div>

                        <div className="go-wallet-donut d-flex align-items-center">
                            <div className="go-wallet-donut-1">
                                <p className="go-wallet-donut-amount">{(((this.props.allBalances || {}).TOTAL || {})[userData.balanceFiat || "EUR"] || 0).toFixed(0)} <span className="fs40rg">({userData.balanceFiat || "EUR"})</span></p>
                                <p className="go-wallet-donut-fiat">{(((this.props.allBalances || {}).TOTAL || {})[userData.balanceCrypto || "BTC"] || 0).toFixed(0)} <span>({userData.balanceCrypto || "BTC"})</span></p>
                            </div>
                            <div className="hidden-xs-down go-wallet-donut-2"/>
                            <div className="hidden-sm-up go-wallet-donut-3"/>
                            {/*<div className="go-donut-chart">*/}
                            {/*</div>*/}
                        </div>

                        {/*(this.props.wallets || []).find(w => w.label === "XCM") &&*/
                            <a href="#/dashboard">
                                <div className="go-wallet-row d-flex align-items-center active">
                                    <div className="go-wallet-row-coin blue"><img src="assets/img/go-coin.svg" alt=""/></div>
                                    <div className="go-wallet-row-name">
                                        <p>XCM</p>
                                        <p/>
                                    </div>
                                    <div className="go-wallet-row-amount">
                                        <p>{(((this.props.allBalances || {}).XCMXCM || {}).XCM || 0).toFixed(0)}</p>
                                        <p>{(((this.props.allBalances || {}).XCMXCM || {})[userData.balanceFiat || "EUR"] || 0).toFixed(0)}({userData.balanceFiat || "EUR"})</p>
                                    </div>
                                </div>
                            </a>
                        }

                        {/*(this.props.wallets || []).find(w => w.label === "REF")  &&*/
                            <a href="#/ambassador">
                                <div className="go-wallet-row d-flex align-items-center">
                                    <div className="go-wallet-row-coin blue"><img src="assets/img/go-coin.svg" alt=""/></div>
                                    <div className="go-wallet-row-name">
                                        <p>XCM<p style={{ lineHeight: "8px", fontSize: "8px" }}>(Ambassador)</p></p>
                                        <p/>
                                    </div>
                                    <div className="go-wallet-row-amount">
                                        <p>{(((this.props.allBalances || {}).XCMREF || {}).XCM || 0).toFixed(0)}</p>
                                        <p>{(((this.props.allBalances || {}).XCMREF || {})[userData.balanceFiat || "EUR"] || 0).toFixed(0)}({userData.balanceFiat || "EUR"})</p>
                                    </div>
                                </div>
                            </a>
                        }

                        {/*
                        <div className="go-wallet-changer-row d-flex align-items-center">
                            <div className="go-wallet-changer-text">Wallet Value</div>
                            <div className="go-wallet-changer-buttons">
                                {walletValues.map(wallet => (
                                    <span
                                        className={wallet.value === this.state.walletValue ? "active" : ""}
                                        key={wallet.value}
                                        onClick={() => {
                                            this.handleWalletValueClick(wallet)
                                        }}
                                    >
                                      {wallet.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                        */}

                        <div className="go-wallet-chart-container">
                            <div className={"go-chart-row-loader" + (this.state.loading ? "" : " d-none")}><i className="far fa-spinner-third spin3s"/></div>
                            <div className="go-wallet-chart ciq-day"/>
                        </div>
                    </div>
                </div>

                <div className={"col-xl-4 col-lg-12 col-md-12 order-xl-3 order-3 go-community" + communityClass}>
                    <div className="go-community-toggle" onClick={this.toggleCommunity}>
                        <i className="far fa-chevron-left"/>
                    </div>

                    <div className="go-community-mask">
                        <div className="go-community-buttons d-flex align-items-center">
                            <div className={"go-group-button" + (this.state.communityChat ? "" : " active")}>
                                <i className="icon-group"/>News
                            </div>
                            <div className={"go-chat-button" + (this.state.communityChat ? " active" : "")}>
                                <div className="go-chat-coming-soon">COMING SOON</div>
                                <i className="icon-chat"/>Community
                            </div>
                        </div>

                        <div className="go-news-container">
                            <div className="go-news-prev" onClick={() => this.owlNewsCarousel.prev()}><i className="fas fa-chevron-left"/></div>
                            <div className="go-news-next" onClick={() => this.owlNewsCarousel.next()}><i className="fas fa-chevron-right"/></div>

                            {((this.state.blogfeed || {}).length > 0) && (
                                <OwlCarousel
                                    ref={carousel => this.owlNewsCarousel = carousel}
                                    onChanged={e => {
                                        if (e.property.name === "position") this.owlNewsPosition = e.property.value;
                                    }}
                                    className="go-news-slider owl-carousel"
                                    loop={true}
                                    autoplay={true}
                                    autoplayHoverPause={true}
                                    smartSpeed={500}
                                    margin={40}
                                    items={3}
                                    dots={false}
                                    responsive={{ 0: { items: 1 }, 550: { items: 2 }, 991: { items: 3 }, 1400: { items: 3 }, 1500: { items: 1 } }}
                                >
                                    {(this.state.blogfeed || []).map((item, i) =>
                                        <a key={i} target="_blank" href={item.link} className="go-news-item">
                                            <img src={item.pic} alt=""/>
                                            <p className="go-news-date"><span className="colv">blog</span> • {new Date(item.pubDate).toDateString()}</p>
                                            <p className="go-news-text">{item.title}</p>
                                        </a>
                                    )}
                                </OwlCarousel>
                            )}
                        </div>

                        <div className="go-medium-container">
                            <div className="go-medium-prev" onClick={() => this.owlMediumCarousel.prev()}><i className="fas fa-chevron-left"/></div>
                            <div className="go-medium-next" onClick={() => this.owlMediumCarousel.next()}><i className="fas fa-chevron-right"/></div>

                            {((this.state.mediumfeed || {}).length > 0) && (
                                <OwlCarousel
                                    ref={carousel => this.owlMediumCarousel = carousel}
                                    onChanged={e => {
                                        if (e.property.name === "position") this.owlMediumPosition = e.property.value;
                                    }}
                                    className="go-medium-slider owl-carousel"
                                    loop={true}
                                    autoplay={true}
                                    autoplayHoverPause={true}
                                    smartSpeed={700}
                                    margin={40}
                                    items={2}
                                    dots={false}
                                    responsive={{ 0: { items: 1 }, 991: { items: 2 }, 1400: { items: 2 }, 1500: { items: 1 } }}
                                >
                                    {(this.state.mediumfeed || []).map((item, i) =>
                                        <a key={i} href={item.link} className="go-medium-item d-flex align-items-start">
                                            <div className="go-medium-item-1">
                                                <p className="go-medium-date"><span className="colb">medium</span> • {new Date(item.pubDate).toDateString()}</p>
                                                <p className="go-medium-text">{item.title}</p>
                                            </div>

                                            <div className="go-medium-item-2">
                                                <img src={item.pic} alt=""/>
                                            </div>
                                        </a>
                                    )}
                                </OwlCarousel>
                            )}
                        </div>

                        <div className="go-chat-container"/>
                    </div>
                </div>

                <div className="go-animation">
                    <img src="assets/img/build-6.svg" className="go-animation-build-1"/>
                    <img src="assets/img/build-7.svg" className="go-animation-build-2"/>
                    <img src="assets/img/tree.svg" className="go-animation-tree"/>
                    <img src="assets/img/build-5.svg" className="go-animation-build-3"/>
                    <div className="go-animation-train-mask">
                        <img src="assets/img/train.svg" className="go-animation-train go-trainmoveh go-anim-dur16"/>
                    </div>
                </div>
            </div>
        );
    }
}

Overview.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        userToken: state.userReducer.userToken,
        userData: state.userReducer.userData,
        candleHistory: state.exchangeReducer.candleHistory,
        referralWallet: state.userReducer.referralWallet,
        balanceOverTime: state.exchangeReducer.balanceOverTime,
        allBalances: state.purchaseReducer.balances,
        wallets: state.purchaseReducer.wallets
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getWallets: (req) => dispatch(PurchaseActions.getWallets(req.token)),
        getUserReferral: (req) => dispatch(AccountActions.getUserReferral(req.userId, req.token)),
        getCandleHistory: (req) => dispatch(ExchangeActions.getCandleHistory(req.data, req.token)),
        getBalanceOverTime: (req) => dispatch(ExchangeActions.getBalanceOverTime(req.data, req.token)),
        getBalances: (req) => dispatch(PurchaseActions.getBalances(req.token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);

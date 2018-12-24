import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import withSizes from "react-sizes";
import ReactTable from "react-table";
import ClipboardJS from "clipboard";
import "react-table/react-table.css";

import { PurchaseActions, AccountActions, ExchangeActions } from "../../redux/app/actions";
import { getTimeString } from "../../constants/Helpers";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            grossAmount: 0,
            display: "history",
            address: "",
            startedAt: "",
            tokenPrice: 0,
            tokens: 0,
            showRemoveModal: false,
            removePaymentId: 0,
            payments: [],

            dateFilter: {},
            typeFilter: {
                TGE: true,
                Withdraw: true,
                Deposit: true,
                Bonus: true
            },

            pageCount: 1,
            pageNumber: 0,
            perPage: 5,
            currentPayments: []
        };
    }

    componentWillMount() {
        this.getPayments();

        this.props.getWallets({
            token: this.props.userToken
        });

        this.props.getBalances({
            token: this.props.userToken
        });


        this.props.getUserReferral({
            userId: this.props.userId,
            token: this.props.userToken
        });

        if (!(this.props.sales || {}).token) {
            this.props.getTokenSales({
                token: this.props.userToken,
            }).then(() => {
                this.forceUpdate();
            });
        }
    }


    componentWillUnmount() {
        if (this.clipboard)
            this.clipboard.destroy();
    }

    componentDidMount() {
        // Axios.get(process.env.REACT_APP_API_URI + "airdrop").then(res =>
        //   this.setState({
        //     airdrop: res.data.data
        //   }));

        this.props.getCurrencyQuote({ token: this.props.userToken });

        this.clipboard = new ClipboardJS("#copy_button");

        this.clipboard.on("success", e => {
            this.btn.setAttribute("data-tip", "Link copied");
            ReactTooltip.show(this.btn);
            setTimeout(() => {
                ReactTooltip.hide(this.btn);
                this.btn.setAttribute("data-tip", "");
            }, 1000);
            e.clearSelection();
        });

        this.drawChart();
    }

    getPayments = () => {
        this.props.getPayments({
            token: this.props.userToken
        }).then(() => {
            const { payments } = this.props;

            if (payments && payments.length) {
                const { perPage, pageNumber } = this.state;
                this.setState({
                    payment: payments[0],
                    pageCount: Math.ceil(payments.length / perPage),
                    currentPayments: payments.slice(pageNumber * perPage, (pageNumber + 1) * perPage)
                });
            }
        });
    };

    // showModal = (paymentId) => {
    //     this.setState({
    //         showRemoveModal: true,
    //         removePaymentId: paymentId
    //     });
    // };
    //
    // dismissModal = () => {
    //     this.setState({
    //         showRemoveModal: false,
    //         removePaymentId: 0
    //     });
    // };
    //
    // paymentDetail = (payment, e) => {
    //     e.preventDefault();
    //
    //     this.setState({
    //         payment
    //     });
    // };
    //
    // removePayment = () => {
    //   if (this.state.removePaymentId) {
    //     this.props.removePayment({
    //       token: this.props.userToken,
    //       paymentId: this.state.removePaymentId
    //     }).then(() => {
    //       this.getPayments();
    //     });
    //   }
    //   this.dismissModal();
    // };
    //
    // handlePageChange = (data) => {
    //   const { perPage } = this.state;
    //   const { selected } = data;
    //
    //   this.setState({
    //     pageNumber: selected,
    //     currentPayments: this.props.payments.slice(selected * perPage, (selected + 1) * perPage)
    //   });
    // };

    makePaymentRow = payment => payment.updatedAt > (
        <tr>
            <td><i className="far fa-question"/> TGE</td>
            <td><i className="far fa-clock"/> ${payment.updatedAt}</td>
            <td><i className="far fa-dollar"/> ${payment.amount.net / payment.creditPrice}</td>
            <td><i className="far fa-dollar"/> ${1 / payment.creditPrice} XCM / ${payment.currency.toUpperCase()} </td>
            <td><i className="far fa-question"/> Paid ${payment.amount.net} ${payment.currency.toUpperCase()} to ${payment.address}<br/>Vesting period ends on ???</td>
        </tr>
    );

    makePaymentData = payment => (
        (!this.state.dateFilter.from || payment.updatedAt > this.state.dateFilter.from) &&
        (!this.state.dateFilter.to || payment.updatedAt < this.state.dateFilter.to) &&
        this.state.typeFilter.TGE &&
        ({
            type: "TGE",
            date: payment.updatedAt,
            amount: payment.amount.net / payment.coinPrice,
            price: `${(1 / payment.coinPrice).toFixed(2)} XCM / ${payment.currency.toUpperCase()}`,
            notes: `Paid ${payment.amount.net.toFixed(3)} ${payment.currency.toUpperCase()} to ${payment.address}`
        })
    );

    onChangeDate = newDate => this.setState({ dateFilter: newDate });

    xcmPage = () => {
        const { sales, payments } = this.props;
        const { airdrop } = this.state;
        return (
            <div className="col-lg-9" style={{ overflow: "hidden" }}>
                <div className="go-dashboard-menu">
                    <span className="disabled"><img src="/assets/img/deposit-icon.png"/>Deposit</span>
                    <span className="disabled"><img src="/assets/img/withdraw-icon.png"/>Withdrawal</span>
                    <span className={this.state.display == "history" ? "active" : ""} onClick={() => this.setState({ display: "history" })}><img src="/assets/img/time-icon.png"/>History</span>
                    {/* <span className={this.state.display == "tge" ? "active" : ""} onClick={() => this.setState({ display: "tge" })}><img src="/assets/images/coin.png"/>TGE</span> */}
                    {/* <a href="#/ambassador"><img src="/assets/img/ambassador-icon.png"/>Ambassador</a> */}
                </div>

                {/* <div style={{background: 'purple', margin: '10px', color: 'white'}}>History</div> */}

                {(this.state.display === "tge") && (
                    <div className="go-dashboard-stats" data-content="dashboard">
                        <div className="go-dashboard-stats-item">
                            <p>Euro collected</p>
                            <img src="assets/img/euro-collected-icon.svg" alt=""/>
                            <p>${parseFloat((((sales || {}).collected || {}).eur || 0).toFixed(0)).toLocaleString()}</p>
                        </div>

                        <div className="go-dashboard-stats-item">
                            <p>xcm sold</p>
                            <img src="assets/img/xcm-sold-icon.svg" alt=""/>
                            <p>{(((sales || {}).token || {}).sold || 0).toLocaleString()}</p>
                        </div>

                        <div className="go-dashboard-stats-item">
                            <p>contributors</p>
                            <img src="assets/img/contributors-icon.svg" alt=""/>
                            <p>{((sales || {}).contributors || 0).toLocaleString()}</p>
                        </div>

                        <div className="go-dashboard-stats-item">
                            <p>xcm price</p>
                            <img src="assets/img/xcm-price-icon.svg" alt=""/>
                            <p>{(((sales || {}).token || {}).price / 100 || 0).toLocaleString()}</p>
                        </div>

                        <div className="go-dashboard-stats-item">
                            <p>xcm market cap</p>
                            <img src="assets/img/xcm-market-icon.svg" alt=""/>
                            <p>{((((sales || {}).token || {}).sold || 0) * (((sales || {}).token || {}).price / 100 || 0)).toLocaleString()}</p>
                        </div>

                        <div className="go-dashboard-stats-item">
                            <p>airdrop participants</p>
                            <img src="assets/img/airdrop-icon.svg" alt=""/>
                            <p>{((airdrop || {}).totalAdherents || 0).toLocaleString()}</p>
                        </div>
                    </div>
                )}

                {(this.state.display === "history") && (
                    <div style={{ overflowX: "hidden", overflowY: "auto" }}>
                        <div style={{ width: "100%", fontSize: "10px", paddingBottom: "5px" }}>
                            <div className="go-table-type-filter">
                                {Object.keys(this.state.typeFilter).map(name =>
                                    <span className={`typeFilter${this.state.typeFilter[name] ? " active" : ""}`} onClick={() => this.setState({
                                        typeFilter: {
                                            ...this.state.typeFilter,
                                            [name]: !this.state.typeFilter[name]
                                        }
                                    })}>{name}</span>
                                )}
                            </div>

                            <div className="go-table-date-filter">
                                From: <input type="date" onChange={e => this.onChangeDate({
                                    from: e.target.value,
                                    to: ((this.state.dateFilter || {}).value || {}).to
                                })}/> To: <input type="date" onChange={e => this.onChangeDate({
                                    from: ((this.state.dateFilter || {}).value || {}).from,
                                    to: e.target.value
                                })}/>
                            </div>
                        </div>

                        <ReactTable
                            style={{ maxHeight: "60vh" }}
                            minRows={3}
                            defaultPageSize={this.props.isMobile ? 5 : 10}
                            filterable={false} sortable={true}
                            data={(((payments || {}).length && payments) || []).map(payment => this.makePaymentData(payment))}
                            columns={[{
                                Header: () => <span><i className="far fa-question"/> Type</span>,
                                accessor: "type", minWidth: 50, maxWidth: 100
                            }, {
                                Header: () => <span><i className="far fa-clock"/> Date</span>,
                                accessor: "date", minWidth: 50, maxWidth: 180,
                                Cell: rowInfo => rowInfo.value && getTimeString(rowInfo.value)
                            }, {
                                Header: () => <span><i className="far fa-dollar"/> Amount</span>,
                                accessor: "amount", minWidth: 50, maxWidth: 120,
                                Cell: rowInfo => rowInfo.value !== undefined && `${rowInfo.value} XCM`
                            }, {
                                Header: () => <span><i className="far fa-dollar"/> Price</span>,
                                accessor: "price", minWidth: 50, maxWidth: 150
                            }, {
                                Header: () => <span><i className="far fa-question"/> Notes</span>,
                                accessor: "notes", minWidth: 50
                            },
                            ]}
                        />
                    </div>
                )}
            </div>
        );
    };

    // bonusTable = () => (
    //     ((this.props.referralWallet || {}).balanceHistory || []).map((v, i, bH) => (i > 0 && (
    //         <tr>
    //             <td><a>{getTimeString(v.timestamp)}</a></td>
    //             <td><strong className>{bH[i].newBalance - bH[i - 1].newBalance}</strong> (XCM)</td>
    //             <td><strong>{v.referral}</strong></td>
    //         </tr>
    //     )))
    // );


    bonusTableData = () => {
        const dateFrom = (this.state.dateFilter.from && this.state.dateFilter.from.valueOf()) || 0;
        const dateTo = (this.state.dateFilter.to && this.state.dateFilter.to.valueOf()) || 0;
        return ((this.props.referralWallet || {}).balanceHistory || []).map((v, i, bH) => (i > 0 &&
            (!dateFrom || v.timestamp > dateFrom) && (!dateTo || v.timestamp < dateTo) &&
            ({
                date: v.timestamp,
                amount: bH[i].newBalance - bH[i - 1].newBalance,
                referral: v.referral
            })));
    };

    ambassadorPage = () => {
        const { userId, referralWallet } = this.props;
        const ambassadorLink = window.location.protocol + "//" + window.location.hostname + "/?refId=" + userId;

        return (
            <div className="col-lg-12" style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
                {/* <div className="go-dashboard-menu">
                    <span className="disabled"><img src="/assets/img/deposit-icon.png"/>Deposit</span>
                    <span className="disabled"><img src="/assets/img/withdraw-icon.png"/>Withdrawal</span>
                    <a href="#/dashboard" onClick={() => this.setState({ display: "history" })}><img src="/assets/img/time-icon.png"/>History</a>
                    <a href="#/dashboard" onClick={() => this.setState({ display: "tge" })}><img src="/assets/images/coin.png"/>TGE</a>
                    <a href="#/ambassador" className="active"><img src="/assets/img/ambassador-icon.png"/>Ambassador</a>
                </div> */}

                <div data-content="ambassador" className="go-ambassador">
                    {!(referralWallet || {}).balance && (
                        <div className="go-ambassador-container">
                            <div className="go-ambassador-content">
                                <h2>Our Ambassadors play an invaluable role in the growth and development of the CoinMetro brand.</h2>
                                <p>CoinMetro Ambassadors are compensated based on the turnover or volumes generated by their referred clients. This compensation can reach as high as 20% of the
                                    commissions paid to CoinMetro on each and every transaction that occurs on any of our offered platforms.</p>
                                <p>To participate in the CoinMetro Ambassador Program please complete our Ambassador Questionnaire by clicking on the button below. We will notify you via email
                                    regarding your application within 48 hours. If approved all you need to do is share your Ambassador link with your prospective clients to have them added to
                                    your client list.</p>
                                {/* <a className="go-ambassador-button">Ambassador Questionnaire <i className="fas fa-chevron-right" /></a> */}
                            </div>

                            <div className="go-ambassador-animation">
                                <div className="go-animation-train-mask"><img src="assets/img/train.svg" className="go-animation-train go-trainmoveh go-anim-dur20"/></div>
                            </div>

                            <img className="go-ambassador-animation-buildings" src="assets/img/ambassador-buildings.png" alt=""/>
                            <img className="go-ambassador-animation-shape" src="assets/img/shape-1.png" alt=""/>
                            <img className="go-ambassador-animation-coins-2" src="assets/img/coins-2.svg" alt=""/>
                            <img className="go-ambassador-animation-coins-1" src="assets/img/coins-1.svg" alt=""/>
                            <img className="go-ambassador-animation-xcm" src="assets/img/xcm.svg" alt=""/>
                            <img className="go-ambassador-animation-build" src="assets/img/ambassador-build-1.svg" alt=""/>

                            <div className="go-ambassador-animation-dashboard-container">
                                <div className="go-ambassador-dashboard-link">
                                    {/* <a href="#" className="go-ambassador-copy-button"><i className="far fa-clone" /> COPY REFERRAL LINK</a> */}
                                    {/*<p>Waiting for Approval ...</p>*/}
                                </div>
                                <img className="go-ambassador-ambassador-dashboard" src="assets/img/ambassador-dashboard.svg" alt=""/>
                            </div>

                            <div className="go-animation-windmill">
                                <img className="go-animation-windmill-base" src="assets/img/windmill-base.svg" alt=""/>
                                <img className="go-animation-windmill-blade spin" src="assets/img/windmill-blade.svg" alt=""/>
                            </div>

                            <img className="go-ambassador-animation-cloud-1 cloudmove anim-dur3-5" src="assets/img/cloud-2.svg" alt=""/>
                            <img className="go-ambassador-animation-cloud-2 cloudmove anim-dur3" src="assets/img/cloud-1.svg" alt=""/>
                            <img className="go-ambassador-animation-bird-1 anim-dur3 floater" src="assets/img/bird.svg" alt=""/>
                            <img className="go-ambassador-animation-bird-2 anim-dur3-5 floater" src="assets/img/bird.svg" alt=""/>
                        </div>
                    )}

                    {/*<div className="position-relative mt-3 text-right">*/}
                    {/*<a href="#" className="go-ambassador-copy-button"><i className="far fa-clone"/> COPY REFERRAL LINK</a>*/}
                    {/*/!*<p>Waiting for Approval ...</p>*!/*/}
                    {/*</div>*/}

                    {((referralWallet || {}).balance > 0) && (
                        <div className="input-group my-3 mt-0 pb-3">
                            <div className="copypaste-link-title mr-3">Your referral link:</div>
                            <input type="text" className="form-control copypaste-link" id="ambassador_link" value={ambassadorLink} readOnly/>
                            <div className="input-group-button">
                                <ReactTooltip event="" eventOff=""/>
                                <button id="copy_button" className="btn btn-sm" type="button" ref={ref => this.btn = ref} data-clipboard-target="#ambassador_link" data-tip="">
                                    <i className="material-icons">content_copy</i>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="go-ambassador-history pt-3">
                        <div>Bonus history</div>
                        <div>Overall: <span>{(referralWallet || {}).balance} XCM</span></div>
                    </div>

                    <div className="go-table-date-filter" style={{ width: "100%" }}>
                        From: <input type="date" onChange={e => this.onChangeDate({
                            from: e.target.value,
                            to: ((this.state.dateFilter || {}).value || {}).to
                        })}/> To: <input type="date" onChange={e => this.onChangeDate({
                            from: ((this.state.dateFilter || {}).value || {}).from,
                            to: e.target.value
                        })}/>
                    </div>

                    <ReactTable
                        style={{ maxHeight: "55vh" }}
                        minRows={3}
                        defaultPageSize={this.props.isMobile ? 5 : 10}
                        filterable={false} sortable={true}
                        data={this.bonusTableData()}
                        columns={[
                            {
                                Header: () => <span><i className="far fa-clock"/> Date</span>,
                                accessor: "date", minWidth: 80,
                                Cell: rowInfo => rowInfo.value && getTimeString(rowInfo.value)
                            }, {
                                Header: () => <span><i className="far fa-dollar"/> Amount</span>,
                                accessor: "amount", minWidth: 80,
                                Cell: rowInfo => rowInfo.value !== undefined && `${rowInfo.value} XCM`
                            }, {
                                Header: () => <span><i className="far fa-user"/> Referral</span>,
                                accessor: "referral", minWidth: 80,
                            }
                        ]}
                    />
                </div>
            </div>
        );
    };

    drawChart = () => {
        const timeFrame = 86400000;

        let stxxW = null;
        $(".go-balance-chart").html("");

        this.props.getBalanceOverTime({
            token: this.props.userToken,
            data: {
                timeframe: timeFrame
            }
        }).then(() => {
            const data = this.props.balanceOverTime[86400000];

            let reformattedData = data.map(c => ({
                "DT": c.timestamp,
                "Close": c.balance
            }));

            console.log(reformattedData);

            stxxW = new CIQ.ChartEngine({
                container: $$$(".go-balance-chart"),
                layout: { "chartType": "mountain" },
            });


            stxxW.chart.yAxis.initialMarginTop = 10;
            stxxW.chart.xAxis.displayGridLines = false;
            stxxW.chart.yAxis.displayGridLines = false;
            // stxxW.chart.yAxis.noDraw = true;
            // stxxW.chart.xAxis.noDraw = true;

            stxxW.setStyle("stx_watermark", "color", "fff");
            stxxW.setStyle("stx_mountain_chart", "color", "rgba(159, 137, 200, 0.5)");
            stxxW.setStyle("stx_mountain_chart", "borderTopColor", "rgba(159, 137, 200, 0.5)");
            stxxW.setStyle("stx_mountain_chart", "backgroundColor", "rgba(159, 137, 200, 0.5)");

            stxxW.newChart("SPY", reformattedData, null, function () {
                stxxW.setSpan({ multiplier: 3, span: "month" });
                // CIQ.Studies.addStudy(stxxW, "ma", inputs, outputs);
                // CIQ.Tooltip({ stx: stxxW, ohl: true, volume: true, series: true, studies: true });
            });
        });
    };

    render() {
        let wallet = null;
        if (this.props.wallets && this.props.wallets.length > 0) {
            this.props.wallets.forEach((wt) => {
                if (wt.label.toLowerCase() === "xcm") {
                    wallet = wt;
                    return true;
                }
            }, this);
        }

        // const { payment, airdrop } = this.state;
        const { sales, currencyQuotes, userData } = this.props;

        return (
            <div>
                <div className="page-dashboard">
                    <div className="row go-content-row d-flex align-items-stretch">
                        <div className="col-lg-3 go-balance-container" style={{ display: this.props.location.pathname.endsWith("ambassador") ? "none" : "block" }}>
                            <div className="go-balance-title-container" style={{ maxHeight: "100vh-300px" }}>
                                <img className="go-balance-icon" src="assets/img/balance-icon.svg" alt=""/>
                                <p className="go-balance-title">balance</p>
                            </div>

                            <p className="go-balance-amount">{(((this.props.allBalances || {}).TOTAL || {})[userData.balanceFiat || "EUR"] || 0).toFixed(0)} <span className="fs40rg">({userData.balanceFiat || "EUR"})</span></p>
                            <p className="go-balance-equivalent">equivalent</p>

                            <div className="go-balance-rows">
                                <div><span>{(((this.props.allBalances || {}).TOTAL || {})[userData.balanceCrypto || "BTC"] || 0).toFixed(0)} </span><span>({userData.balanceCrypto || "BTC"})</span></div>
                                {/* <div>
                                    <span>
                                        {currencyQuotes && (
                                            (this.props.wallets || []).reduce((s, w) => s + w.balance || 0, 0) * 0.12 * currencyQuotes.btcusd / currencyQuotes.btceur).toFixed(2)
                                        }
                                    </span>

                                    <span>USD</span>
                                </div> */}
                            </div>

                            <div className="go-balance-chart">
                                <div className="go-chart-row-loader"><i className="far fa-spinner-third spin3s"/></div>
                            </div>

                            <p className="go-balance-wallet-title">Wallet</p>

                            <div className="go-wallet-container">
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
                            </div>
                        </div>

                        {this.props.location.pathname.endsWith("dashboard") && this.xcmPage()}
                        {this.props.location.pathname.endsWith("ambassador") && this.ambassadorPage()}
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

Dashboard.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        userToken: state.userReducer.userToken,
        userId: state.userReducer.userId,
        userData: state.userReducer.userData,
        payments: state.purchaseReducer.payments,
        wallets: state.purchaseReducer.wallets,
        sales: state.purchaseReducer.sales,
        balanceOverTime: state.exchangeReducer.balanceOverTime,
        allBalances: state.purchaseReducer.balances,
        currencyQuotes: state.purchaseReducer.currencyQuotes,
        referralWallet: state.userReducer.referralWallet
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPayments: (req) => dispatch(PurchaseActions.getPayments(req.token)),
        getWallets: (req) => dispatch(PurchaseActions.getWallets(req.token)),
        getTokenSales: (req) => dispatch(PurchaseActions.getTokenSales(req.token)),
        getUserReferral: (req) => dispatch(AccountActions.getUserReferral(req.userId, req.token)),
        removePayment: (req) => dispatch(PurchaseActions.removePayment(req.paymentId, req.token)),
        getBalanceOverTime: (req) => dispatch(ExchangeActions.getBalanceOverTime(req.data, req.token)),
        getCurrencyQuote: (req) => dispatch(PurchaseActions.getCurrencyQuote(req.token)),
        getBalances: (req) => dispatch(PurchaseActions.getBalances(req.token))
    };
};

const mapSizesToProps = ({ width }) => ({
    isMobile: width < 480,
});

export default connect(mapStateToProps, mapDispatchToProps)(withSizes(mapSizesToProps)(Dashboard));


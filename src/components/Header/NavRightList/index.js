import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavDropDownMenu from './NavDropDownMenu';
import BalanceButton from '../../Buttons/BalanceButton';
import RefBalanceButton from '../../Buttons/RefBalanceButton';
import BuyCoinButton from '../../Buttons/BuyCoinButton';
import ReferralModal from '../../Modals/ReferralModal';

import { AccountActions, PurchaseActions, KycActions } from '../../../redux/app/actions';
import { pushToGTM } from '../../../constants/Helpers';

const FomoClient = require('fomo-nodejs-sdk');
const client = new FomoClient('nkzcv5vapXebxJgRsOnIsQ');
const ReconnectingWebSocket = require('reconnecting-websocket');

class NavRightList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            showAirdropModal: false,
            airdropModalError: "",
            balance: 0,
            sales: {},
            eurBalance: 0,
            usdBalance: 0,
            ref_balance: 0,
            ref_eurBalance: 0,
            ref_usdBalance: 0,
            ref_walletId: '',
            existRefBalance: false,
            ambassadorLink: ''
        };
    }

    componentDidMount() {
        $('#kycPopup').popup({
            outline: true, // optional
            focusdelay: 400, // optional
            vertical: 'bottom', //optional
        });

        if (["pending", "saleContributor"].indexOf((this.props.userData || {}).isAirdrop) >= 0 && (this.props.userData || {}).restrictions == "no") {
            this.verifyAirdropCode();
        }
        this.timer4 = setInterval(() => {
            if (!!window.requestAirdropModal) {
                window.requestAirdropModal = false;
                this.openAirdropModal();
            }
        }, 200);

        const pushBack = () => {
            if (!this.props.flashsaleTokenOK) {
                let links = this.props.location.pathname.split("/");
                if (links.indexOf('purchase') > -1) {
                    this.context.router.push('/dashboard/mainsale');
                }
            }
        };

        const getData = () => Promise.all([
            this.props.getPayments({
                token: this.props.userToken
            }),
            // this.props.getTokenSales({})
        ]).then(this.updateState);

        const moreData = () => Promise.all([
            this.props.getWallets({
                token: this.props.userToken
            }),
            this.props.getCurrencyQuote({
                token: this.props.userToken
            })
        ]).then(this.updateState);

        const kycPopup = () => {
            if (this.props.location.pathname.indexOf("kyc") < 0)
                this.props.verifyChecking({
                    token: this.props.userToken,
                    cb: () => {
                        if (this.props.kycStatus == "none")
                            $('#kycPopup').popup('show');
                    }
                });
        };

        this.timer1 = setInterval(getData, 60 * 1000)
        this.timer2 = setInterval(pushBack, 3 * 1000);
        this.timer3 = setInterval(moreData, 120 * 1000);
        this.timer4 = setInterval(kycPopup, 120 * 1000);
        getData();
        moreData();
        pushBack();
        kycPopup();

        this.saleStatsWS = new ReconnectingWebSocket(`wss://api.coinmetro.com/${process.env.NODE_ENV == "production" ? "" : "staging/"}sale-stats/ws`);

        this.saleStatsWS.addEventListener('open', e => setInterval(() => this.saleStatsWS.send(''), 20 * 1000));
        this.saleStatsWS.addEventListener('message', e => this.handleSaleStatsData(e.data));
    }

    componentWillUnmount() {
        if (this.timer1) clearInterval(this.timer1);
        if (this.timer2) clearInterval(this.timer2);
        if (this.timer3) clearInterval(this.timer3);
        if (this.timer4) clearInterval(this.timer4);
        if (this.saleStatsWS) this.saleStatsWS.close(1000, '', { keepClosed: true });
    }

    closeModal = () => {
        this.setState({
            modalIsOpen: false
        });
    };

    goToReferral = () => {
        this.setState({
            modalIsOpen: true
        });
    };

    goToReferralDashboard = () => {
        this.setState({
            modalIsOpen: false
        }, () => {
            this.context.router.push('/referral-dashboard');
        });
    };

    becomeReferral = () => {
        this.props.getUserReferral({
            userId: this.props.userId,
            token: this.props.userToken
        }).then(() => {
            const { referralWallet, sales, currencyQuotes } = this.props;
            const ref_balance = referralWallet.balance;
            const ref_eurBalance = sales ? ref_balance * sales.token.price / 100 : 0;
            this.setState({
                ref_balance,
                ref_eurBalance,
                ref_usdBalance: currencyQuotes ? ref_eurBalance * currencyQuotes.btcusd / currencyQuotes.btceur : 0,
                existRefBalance: true,
                ref_walletId: referralWallet._id,
                modalIsOpen: true
            });
        });
    };

    signOut = (e) => {
        e.preventDefault();
        this.props.signOut({
            data: this.props.userToken,
        });
    };

    verifyAirdropCode = code => {
        const oldState = (this.props.userData || {}).isAirdrop;
        return Promise.resolve()
        /*this.props.verifyAirdropCode({
            token: this.props.userToken,
            code
        })*/
        .then(() => {
            this.setState({
                showAirdropModal: !(this.props.userData || {}).isAirdrop || oldState != (this.props.userData || {}).isAirdrop,
                airdropModalError: (this.props.userData || {}).isAirdrop == "pending" ? "pending" :
                    (((this.props.userData || {}).isAirdrop && "takeit") || "Wrong password!")
            });
        });
    };

    openAirdropModal = () => {
        if (!this.props.userData) return;

        if (this.props.userData.restrictions === "no") {
            this.verifyAirdropCode().then(() => {
                if (!this.showAirdropModal) {
                    this.setState({
                        showAirdropModal: true,
                        airdropModalError: this.props.userData.isAirdrop
                    });
                }
            });
        } else if (!this.props.userData.restrictions) {
            this.infoModal.openModal();
        } else {
            this.setState({
                showAirdropModal: true,
                airdropModalError: "restricted"
            });
        }
    };

    stepAirdropModal = () => {
        if (this.state.airdropModalError == "takeit") {
            this.setState({
                showAirdropModal: true,
                airdropModalError: this.props.userData.isAirdrop
            });
        } else if (this.state.airdropModalError == "pending") {
            this.setState({
                showAirdropModal: false
            });
            this.context.router.push('/purchase/currency');
        }
    };

    closeAirdropModal = () => this.setState({
        showAirdropModal: false
    });

    updateUserProfile = (data) => {
        this.props.updateUserProfile({
            userId: this.props.userId,
            token: this.props.userToken,
            data
        }).then(() => {
            if (this.props.userData.restrictions === "no")
                this.openAirdropModal();
        });
    };

    handleSaleStatsData = (data) => {
        try {
            this.props.getTokenSalesSuccess({ data: JSON.parse(data) });
            setTimeout(this.updateState, 300);
        } catch (e) { }
    };

    handlePaymentsData = (data) => {
        try {
            this.props.getPaymentsSuccess({ data: JSON.parse(data) });
            setTimeout(this.updateState, 300);
        } catch (e) { }
    };

    updateState = () => {
        const marketingTracking = (ip, payment, sales, userData) => {
            if (process.env.NODE_ENV !== "production")
                return;

            const coinAmount = Math.round(payment.amount.net / payment.coinPrice);
            const eurValue = coinAmount * sales.token.price / 100;

            pushToGTM({
                'event': 'cm-deposit-ok',
                'gtm-ee-event-category': 'Enhanced Ecommerce',
                'gtm-ee-event-action': 'Purchase',
                'gtm-ee-event-non-interaction': 'True',
                'ecommerce': {
                    'currencyCode': "EUR",
                    'purchase': {
                        'actionField': {
                            'id': payment._id,
                            'revenue': eurValue
                        },
                        'products': [{
                            'name': 'XCM',
                            'id': 'P1',
                            'price': sales.token.price / 100,
                            'quantity': coinAmount
                        }]
                    }
                },
                'sub_data': {
                    's3': payment.currency,
                    's4': payment.amount.net,
                }
            }, 'depositOkEvent');

            let saleEvent = client.FomoEventBasic();
            saleEvent.event_type_id = '50317';
            saleEvent.title = 'Purchase event';
            saleEvent.email_address = userData.email;
            saleEvent.url = 'https://go.coinmetro.com';
            saleEvent.addCustomEventField('username', userData.firstname || userData.username);
            saleEvent.addCustomEventField('XCM', coinAmount);

            // if (process.env.NODE_ENV === "production")
            //     client.createEvent(saleEvent);
        };

        const { wallets, sales, payments, currencyQuotes } = this.props;
        const newState = {};

        if (wallets === undefined || sales === undefined || payments === undefined ||
            wallets === null || sales === null || payments === null)
            return;

        wallets.forEach(wallet => {
            if (wallet.label.toLowerCase() === 'xcm') {
                newState.balance = wallet.balance;
            } else if (wallet.label.toLowerCase() === 'ref') {
                newState.ref_balance = wallet.balance;
                newState.existRefBalance = true;
                newState.ref_walletId = wallet._id;
            }
        });

        newState.eurBalance = newState.balance * sales.token.price / 100;
        newState.usdBalance = newState.eurBalance * currencyQuotes.btcusd / currencyQuotes.btceur;
        newState.ref_eurBalance = newState.ref_balance * sales.token.price / 100;
        newState.ref_usdBalance = newState.ref_eurBalance * currencyQuotes.btcusd / currencyQuotes.btceur;

        this.setState({
            ...newState
        });

        if (payments.length) {
            payments.forEach(payment => {
                if (payment.credited && !payment.seen) {
                    this.props.trackPayment({
                        payment,
                        token: this.props.userToken
                    }).then(trackingData => {
                        marketingTracking(trackingData.ip, payment, sales, this.props.userData);
                    }).then(() => {
                        if ((this.props.userData || {}).isAirdrop == "pending" && (this.props.userData || {}).this.props.userData.restrictions == "no") {
                            this.verifyAirdropCode();
                        }
                    });
                }
            });
        }
    };

    render() {
        return (
            <div>
                <div id="kycPopup">
                    <div style={{display: "inline-block"}}>
                        To fully access your account you need to undergo the Know Your Client process. <a href="#/kyc" onClick={() => $('#kycPopup').popup('hide')}>Get started here.</a>
                    </div>
                </div>
                <div className="h-100 d-xl-flex align-items-center justify-content-between hidden-md-up">
                    <div className="h-100 d-flex align-items-center justify-content-between">
                        <a href="https://coinmetro.com"><img src="/assets/logo-icon-white.png" alt="{APPCONFIG.brand}" height="40" /></a>
                        &nbsp;
                        <BuyCoinButton router={this.context.router} flashsaleTokenOK={this.props.flashsaleTokenOK} />
                        <NavDropDownMenu signOut={this.signOut} userData={this.props.userData} />
                    </div>

                    <div className="h-100 d-flex align-items-center justify-content-between">
                        <BalanceButton
                            router={this.context.router}
                            balance={this.state.balance || 0}
                            eurBalance={(this.state.eurBalance || 0).toFixed(2)}
                            usdBalance={(this.state.usdBalance || 0).toFixed(2)}
                        />

                        <div className="px-3 py-2">
                            {((this.props.userData || {}).restrictions || "no") == "no"
                                ? ((this.props.userData || {}).isAirdrop
                                    ? <img height="45px" className="cursor-pointer" src="/assets/images/airdrop_icon_2_done.png"
                                        onClick={this.openAirdropModal}
                                        onMouseEnter={e => e.target.src = "/assets/images/airdrop_icon_2_done_hover.png"}
                                        onMouseLeave={e => e.target.src = "/assets/images/airdrop_icon_2_done.png"} />
                                    : <img height="45px" className="cursor-pointer" src="/assets/images/airdrop_icon_2.png"
                                        onClick={this.openAirdropModal}
                                        onMouseEnter={e => e.target.src = "/assets/images/airdrop_icon_2_hover.png"}
                                        onMouseLeave={e => e.target.src = "/assets/images/airdrop_icon_2.png"} />
                                )
                                : <img height="45px" className="cursor-pointer" src="/assets/images/airdrop_icon_2_no.png" onClick={this.openAirdropModal} />
                            }
                        </div>

                        <RefBalanceButton
                            existRefBalance={this.state.existRefBalance}
                            ref_balance={this.state.ref_balance || 0}
                            ref_eurBalance={(this.state.ref_eurBalance || 0).toFixed(2)}
                            ref_usdBalance={(this.state.ref_usdBalance || 0).toFixed(2)}
                            becomeReferral={this.becomeReferral}
                            goToReferral={this.goToReferral}
                        />
                    </div>
                </div>

                <div className="h-100 d-flex align-items-center justify-content-between hidden-sm-down">
                    <div><a href="https://coinmetro.com"><img src="/assets/logo-white.png" alt="{APPCONFIG.brand}" height="40" /></a></div>
                    <div><BuyCoinButton router={this.context.router} flashsaleTokenOK={this.props.flashsaleTokenOK} /></div>
                    <div>
                        <BalanceButton
                            router={this.context.router}
                            balance={this.state.balance || 0}
                            eurBalance={(this.state.eurBalance || 0).toFixed(2)}
                            usdBalance={(this.state.usdBalance || 0).toFixed(2)}
                        />
                    </div>
                    <div>
                        <RefBalanceButton
                            existRefBalance={this.state.existRefBalance}
                            ref_balance={this.state.ref_balance || 0}
                            ref_eurBalance={(this.state.ref_eurBalance || 0).toFixed(2)}
                            ref_usdBalance={(this.state.ref_usdBalance || 0).toFixed(2)}
                            becomeReferral={this.becomeReferral}
                            goToReferral={this.goToReferral}
                        />
                    </div>

                    <div className="px-3 py-2">
                        {(this.props.userData.restrictions || "no") == "no"
                            ? (this.props.userData.isAirdrop
                                ? <img height="45px" className="cursor-pointer" src="/assets/images/airdrop_icon_2_done.png"
                                    onClick={this.openAirdropModal}
                                    onMouseEnter={e => e.target.src = "/assets/images/airdrop_icon_2_done_hover.png"}
                                    onMouseLeave={e => e.target.src = "/assets/images/airdrop_icon_2_done.png"} />
                                : <img height="45px" className="cursor-pointer" src="/assets/images/airdrop_icon_2.png"
                                    onClick={this.openAirdropModal}
                                    onMouseEnter={e => e.target.src = "/assets/images/airdrop_icon_2_hover.png"}
                                    onMouseLeave={e => e.target.src = "/assets/images/airdrop_icon_2.png"} />
                            )
                            : <img height="45px" className="cursor-pointer" src="/assets/images/airdrop_icon_2_no.png" onClick={this.openAirdropModal} />
                        }
                    </div>

                    <div><NavDropDownMenu signOut={this.signOut} userData={this.props.userData} /></div>
                </div>

                <ReferralModal
                    isOpen={this.state.modalIsOpen}
                    userId={this.props.userId}
                    closeModal={this.closeModal}
                    goToReferralDashboard={this.goToReferralDashboard}
                />

                {/*<Websocket url="wss://api.coinmetro.com/staging/sale-stats/ws" ref={WS => this.paymentWS = WS}
                    onOpen={() => setInterval(() => this.paymentWS.sendMessage(''), 20 * 1000)} onMessage={this.handleSaleStatsData} />*/}
                {/*<Websocket url="wss://api.coinmetro.com/staging/payments/ws" onMessage={this.handlePaymentsData}/>*/}
            </div>
        );
    }
}

NavRightList.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        userData: state.userReducer.userData,
        userId: state.userReducer.userId,
        userToken: state.userReducer.userToken,
        referralWallet: state.userReducer.referralWallet,
        wallets: state.purchaseReducer.wallets,
        loading: state.purchaseReducer.getWalletsLoading,
        error: state.purchaseReducer.getWalletsError,
        sales: state.purchaseReducer.sales,
        payments: state.purchaseReducer.payments,
        flashsaleTokenOK: state.purchaseReducer.flashsaleTokenOK,
        location: state.routing.locationBeforeTransitions,
        currencyQuotes: state.purchaseReducer.currencyQuotes,
        kycStatus: state.kycReducer.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: (req) => dispatch(AccountActions.signOut(req.data)),
        getWallets: (req) => dispatch(PurchaseActions.getWallets(req.token)),
        getTokenSales: (req) => dispatch(PurchaseActions.getTokenSales(req.token)),
        getTokenSalesSuccess: (req) => dispatch(PurchaseActions.getTokenSalesSuccess(req.data)),
        getPayments: (req) => dispatch(PurchaseActions.getPayments(req.token)),
        getPaymentsSuccess: (req) => dispatch(PurchaseActions.getPaymentsSuccess(req.data)),
        getCurrencyQuote: (req) => dispatch(PurchaseActions.getCurrencyQuote(req.token)),
        getUserReferral: (req) => dispatch(AccountActions.getUserReferral(req.userId, req.token)),
        trackPayment: (req) => dispatch(PurchaseActions.trackPayment(req.payment, req.token)),
        verifyAirdropCode: (req) => dispatch(AccountActions.verifyAirdropCode(req.token, req.code)),
        updateUserProfile: (req) => dispatch(AccountActions.updateUserProfile(req.data, req.token, req.userId)),
        verifyChecking: (req) => dispatch(KycActions.verifyChecking(req.token, req.cb))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavRightList);

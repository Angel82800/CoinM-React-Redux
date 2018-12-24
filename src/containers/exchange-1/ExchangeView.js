import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { PurchaseActions, ExchangeActions } from "../../redux/app/actions";
import { getCrypto } from "../../constants/Cryptos";
import ExchangeDonut from "./ExchangeDonut";
import ExchangeActionsRow from "./ExchangeActionsRow";
import ExchangeCryptoStats from "./ExchangeCryptoStats";
import ExchangeBuy from "./ExchangeBuy";
import ExchangeDeposit from "./ExchangeDeposit";
import ExchangeCalendar from "./ExchangeCalendar";

class ExchangeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cryptos: [],
      cryptoId1: 1,
      crypto1: getCrypto({ id: 1 }),
      wallet1: null,
      cryptoId2: 2,
      crypto2: getCrypto({ id: 2 }),
      wallet2: null,
      theme1: { class: "blue-theme", baseC: "rgba(101, 122, 168, 1)", borderC: "rgba(162, 137, 255, 1)" },
      theme2: { class: "orange-theme", baseC: "rgba(135, 120, 98, 1)", borderC: "rgba(255, 214, 0, 1)" },
      addables: [],
      addNew: false,
      exchangeActive: false,
      transferActive1: false,
      transferActive2: false,
      cryptoStats: [
        { class: "blue", currency: 'Ripple', symbol: 'XRP', icon: 'xrp-icon-m.png' },
        { class: "orange", currency: 'Bitcoin', symbol: 'BTC', icon: 'btc-icon-m.png' }
      ],
      isCalendar1: false,
      isCalendar2: false
    };
  }

  createWallet = symbol => {
    this.props.createWallet({
      data: { currency: symbol.toUpperCase() },
      token: this.props.userToken
    }).then(() => {
      this.setState({
        addNew: false
      });
      this.getWallets();
    });
  };

  disableWallet = walletId => {
    const data = { walletId };
    this.props.disableWallet({
      data,
      token: this.props.userToken
    }).then(() => {
      this.getWallets();
    })
  };

  getWallets = () =>
    Promise.all([
      this.props.getWallets({
        token: this.props.userToken
      }),
      this.props.getPrices({
        token: this.props.userToken,
        pairs: ""
      }),
      this.props.getCandleHistory({
        token: this.props.userToken,
        data: {
          pair: this.state.crypto1.symbol + "USD",
          timeframe: 14400000,
          from: Date.now() - 86400000
        }
      }),
      this.props.getCandleHistory({
        token: this.props.userToken,
        data: {
          pair: this.state.crypto2.symbol + "USD",
          timeframe: 14400000,
          from: Date.now() - 86400000
        }
      }),
      this.props.getCandleHistory({
        token: this.props.userToken,
        data: {
          pair: this.state.crypto1.symbol + "USD",
          timeframe: 86400000,
          from: Date.now() - 86400000 * 7
        }
      }),
      this.props.getCandleHistory({
        token: this.props.userToken,
        data: {
          pair: this.state.crypto2.symbol + "USD",
          timeframe: 86400000,
          from: Date.now() - 86400000 * 7
        }
      })
    ]).then(() => {
      // console.log(this.props.candleHistory);
      const btcHist = (this.props.candleHistory["BTCUSD"] || {})['14400000'];
      this.setState({
        cryptos: getCrypto().map(crypto => {
          const wallet = this.props.wallets.find(w => w.label !== "REF" && w.currency === crypto.symbol) || ({ balance: 0, _id: null });
          const addInfo = {}; const cHist = (this.props.candleHistory[crypto.symbol + "USD"] || {})['14400000'];
          if ((cHist || {}).length && !crypto.isFiat) {
            addInfo.vol24h = cHist.reduce((vol, c) => ((c.Volume || 0) + vol), 0);
            addInfo.var24hUSD = ((cHist[cHist.length - 1].Close / cHist[cHist.length - 7].Open - 1) * 100);
            addInfo.var24hBTC = (btcHist || 0) && ((cHist[cHist.length - 1].Close / cHist[cHist.length - 7].Open / (btcHist[btcHist.length - 1].Close / btcHist[btcHist.length - 7].Open)) - 1) * 100;
            addInfo.high24h = Math.max(...cHist.map(c => c.High));
            addInfo.low24h = Math.min(...cHist.map(c => c.Low));
            addInfo.sevenDays = (this.props.candleHistory[crypto.symbol + "USD"]['86400000'] || []).slice(-7).map(c => (c.Close / c.Open - 1) * 100);
          }

          return ({
            ...crypto,
            ...addInfo,
            walletId: wallet._id,
            amount: wallet.balance,
            amountUSD: wallet.balance * this.props.spotPrices[`${crypto.symbol}USD`],
            amountBTC: wallet.balance * this.props.spotPrices[`${crypto.symbol}USD`] / this.props.spotPrices[`BTCUSD`],
            rateUSD: this.props.spotPrices[`${crypto.symbol}USD`],
            rateBTC: this.props.spotPrices[`${crypto.symbol}USD`] / this.props.spotPrices[`BTCUSD`]
          })
        })
      }, () => this.setState({
        wallet1: this.state.cryptos.find(crypto => crypto.id == this.state.cryptoId1),
        wallet2: this.state.cryptos.find(crypto => crypto.id == this.state.cryptoId2)
      }));
    });

  componentDidMount() {
    const anchors = [0, 0.7, 1.7];

    const letsScroll = (element, incr) => {
      const currentAnchor = anchors.findIndex(a => element.scrollTop / element.offsetHeight - a < 0.1);
      const newAnchor = anchors[Math.min(Math.max(currentAnchor + incr, 0), 2)] * element.offsetHeight;
      if (!letsScroll.isScrolling) {
        letsScroll.isScrolling = true;
        console.log(newAnchor);
        $(element).animate({ scrollTop: `${newAnchor}px` }, '200ms', () => letsScroll.isScrolling = false);
      }
      // else console.log('scrolling...');
    }

    // $('.row.exchange-row').on("mousewheel", function (e) {
    //   // console.log('lol?')
    //   e.preventDefault();
    //   e.stopPropagation();
    //   if (e.originalEvent.deltaY > 0) letsScroll(this, 1);
    //   else letsScroll(this, -1);
    //   // console.log(e);
    //   return false;
    // });

    // $('.exchange-donut-range').on("mousewheel", function (e) {
    //   //  console.log('bidabadadaum?')
    //   // e.preventDefault();
    //   e.stopPropagation();
    //   // if (e.originalEvent.deltaY > 0) letsScroll(this, 1);
    //   // else letsScroll(this, -1);
    //   // console.log(e);
    //   // return false;
    // });


    // $('.exchange-charts').on("mousewheel", function (e) {
    //   // console.log('lil?')
    //   // e.preventDefault();
    //   e.stopPropagation();
    //   // return false;
    // });

    // $('.row.exchange-row').on('touchstart', function (e) {
    //   var swipe = e.originalEvent.touches,
    //     start = swipe[0].pageY;
    //   let hasSwiped = false;

    //   $(this).on('touchmove', function (e) {
    //     var contact = e.originalEvent.touches,
    //       end = contact[0].pageY,
    //       distance = end - start;
    //     e.preventDefault();
    //     e.stopPropagation();

    //     if (distance < -30 && !hasSwiped) {
    //       hasSwiped = true;
    //       letsScroll(this, 1);
    //     }
    //     if (distance > 30 && !hasSwiped) {
    //       hasSwiped = true;
    //       letsScroll(this, -1);
    //     }
    //     return false;
    //   })
    //     .one('touchend', function () {
    //       $(this).off('touchmove touchend');
    //     });
    // });

    const dataCollect = () =>
      Promise.all([
        this.getWallets()
      ]).catch(err => console.log(err))
        .then(() => { this.timeout = setTimeout(dataCollect, 5000) });
    dataCollect();
  }

  componentWillUnmount() {
    if (this.timeout)
      clearTimeout(this.timeout);
    this.timeout = null;
  }

  changeCrypto = (i) => (newId) =>
    this.setState({
      [`cryptoId${i}`]: newId,
      [`crypto${i}`]: getCrypto({ id: newId }),
      [`wallet${i}`]: this.state.cryptos.find(crypto => crypto.id == newId)
    }, this.getWallets);

  onClickExchange = () => this.setState({
    exchangeActive: !this.state.exchangeActive,
    transferActive1: false,
    transferActive2: false
  });

  onClickTransfer1 = () => this.setState({
    exchangeActive: false,
    transferActive1: !this.state.transferActive1,
    transferActive2: false
  });

  onClickTransfer2 = () => this.setState({
    exchangeActive: false,
    transferActive1: false,
    transferActive2: !this.state.transferActive2
  });

  sendOrder = order =>
    this.props.sendOrder({
      token: this.props.userToken,
      order
    }).then((res) => {
      setTimeout(this.getWallets, 200);
      return res;
    });

  render() {
    return (
      <div className="exchange-section">
        <a href="#/overview" style={{ position: "absolute", top: 0, right: 0, width: "40px", zIndex: 9999999 }}><img className="goback-logo" src="/assets/img/logo-yellow.svg" /></a>
        <div className="row exchange-row">
          <div className="col-lg-9 col-md-12">
            <div className="row">
              <div className={`${this.state.crypto1.isFiat ? "hidden-xs-up" : (this.state.crypto2.isFiat ? "col-12" : "col-lg-6")} h45vh-xl-up h35vh-lg-down exchange-charts-container`}>

                {!this.state.isCalendar1 ?
                  <ExchangeBuy pos='left' key={1} crypto={this.state.wallet1} theme={this.state.theme1} /> :
                  <ExchangeCalendar className="col-12" crypto={this.state.wallet1 || this.state.crypto1} />}

                <a className="btn btn-primary text-white text-small" style={{ padding: "0.5rem", position: "absolute", top: 0, left: "10px", zIndex: 99999999 }}
                  onClick={() => this.setState({ isCalendar1: !this.state.isCalendar1 })}>{this.state.isCalendar1 ? <img style={{width: "30px"}} src="assets/images/line_chart_white.png"/> : <img style={{width: "30px"}} src="assets/images/calendar_white.png"/>}</a>
              </div>

              <div className={`${this.state.crypto2.isFiat ? "hidden-xs-up" : (this.state.crypto1.isFiat ? "col-12" : "col-lg-6")} h45vh-xl-up h35vh-lg-down exchange-charts-container`}>

                {!this.state.isCalendar2 ?
                  <ExchangeBuy pos='right' key={2} crypto={this.state.wallet2} theme={this.state.theme2} /> :
                  <ExchangeCalendar className="col-12" crypto={this.state.wallet2 || this.state.crypto2} />}

                <a className="btn btn-primary text-white text-small hidden-md-down" style={{ padding: "0.5rem", position: "absolute", top: 0, left: 0, zIndex: 99999999 }}
                  onClick={() => this.setState({ isCalendar2: !this.state.isCalendar2 })}>{this.state.isCalendar2 ? <img style={{width: "30px"}} src="assets/images/line_chart_white.png"/> : <img style={{width: "30px"}} src="assets/images/calendar_white.png"/>}</a>
                <a className="btn btn-primary text-white text-small hidden-lg-up" style={{ padding: "0.5rem", position: "absolute", top: 0, left: "10px", zIndex: 99999999 }}
                  onClick={() => this.setState({ isCalendar2: !this.state.isCalendar2 })}>{this.state.isCalendar2 ? <img style={{width: "30px"}} src="assets/images/line_chart_white.png"/> : <img style={{width: "30px"}} src="assets/images/calendar_white.png"/>}</a>
              </div>

              <div className={`${this.state.crypto1.isFiat || this.state.crypto2.isFiat ? "hidden-lg-up" : "hidden-xs-up"} col-12 h35vh exchange-crypto-stats-container`}>
                <ExchangeCryptoStats crypto={this.state.crypto1.isFiat ? this.state.wallet2 : this.state.wallet1} />
              </div>

              <div className="col-12 exchange-actions-row-container h20vh-xl-up h30vh-lg-down pr-1 pl-1">
                <ExchangeActionsRow prices={this.props.spotPrices} wallets={this.state.cryptos} changeCrypto={this.changeCrypto} sendOrder={this.sendOrder}
                  cryptoLeft={this.state.wallet1 || this.state.crypto1} cryptoRight={this.state.wallet2 || this.state.crypto2} />
              </div>

              <div className={`${this.state.crypto1.isFiat ? "hidden-xs-up" : (this.state.crypto2.isFiat ? "col-12 hidden-md-down" : "col-lg-6")} h35vh exchange-crypto-stats-container`}>
                <ExchangeCryptoStats crypto={this.state.wallet1} />
              </div>

              <div className={`${this.state.crypto2.isFiat ? "hidden-xs-up" : (this.state.crypto1.isFiat ? "col-12 hidden-md-down" : "col-lg-6")} h35vh exchange-crypto-stats-container`}>
                <ExchangeCryptoStats crypto={this.state.wallet2} />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-12">
            <div className="row">
              <div className="col-lg-12 exchange-donut-container">
                <div className="exchange-donut">
                  <ExchangeDonut id="1" cryptos={this.state.cryptos} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ExchangeView.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    userId: state.userReducer.userId,
    userToken: state.userReducer.userToken,
    wallets: state.purchaseReducer.wallets,
    balanceOverTime: state.exchangeReducer.balanceOverTime,
    spotPrices: state.exchangeReducer.spotPrices,
    candleHistory: state.exchangeReducer.candleHistory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWallets: (req) => dispatch(PurchaseActions.getWallets(req.token)),
    getPrices: (req) => dispatch(ExchangeActions.getPrices(req.token, req.pairs)),
    createWallet: (req) => dispatch(PurchaseActions.createWallet(req.data, req.token)),
    disableWallet: (req) => dispatch(ExchangeActions.disableWallet(req.data, req.token)),
    sendOrder: (req) => dispatch(ExchangeActions.sendOrder(req.token, req.order)),
    getCandleHistory: (req) => dispatch(ExchangeActions.getCandleHistory(req.data, req.token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeView);

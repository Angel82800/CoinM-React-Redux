import React, { Component } from "react";

import { getCrypto } from "../../constants/Cryptos";

Number.prototype.toPrecisionMy = function (p) {
  return parseFloat(this.toPrecision(p)).toFixed(10).replace(/0/g, ' ').trimRight().replace(/ /g, '0').replace(/\.$/, '.0');
};

class ExchangeArrow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 'ready',
      timer: null,
      text: `Sell ${props.symbolSell} Buy ${props.symbolBuy}`
    };
  }

  handleClick = () => {
    const { symbolBuy, symbolSell, onLoadComplete, invert, id } = this.props;
    switch (this.state.step) {
      case 'ready':
        return this.setState({ step: 'activated' }, () => {
          this.state.timer = setTimeout(() => this.setState({ step: 'countingDown' }, () => {
            this.state.timer = setTimeout(() => this.setState({ step: 'ready' }), 2000);
          }), 300);
        });
      case 'countingDown':
        return this.setState({ step: 'sending' }, () =>
          this.props.onLoadComplete()
            .then(trade => this.setState({ step: 'success', msg: trade }, () => {
              clearTimeout(this.state.timer);
              this.state.timer = setTimeout(() => this.setState({ step: 'ready' }), 3000);
            }))
            .catch(err => this.setState({ step: 'failure', msg: err }, () => {
              clearTimeout(this.state.timer);
              this.state.timer = setTimeout(() => this.setState({ step: 'ready' }), 3000);
            })));
    };
  }

  componentDidUpdate(prevProps) {
    const { id, symbolBuy, symbolSell } = this.props;

    if (symbolSell !== prevProps.symbolSell || symbolBuy !== prevProps.symbolBuy) {
      // console.log('....');
      clearTimeout(this.state.timer);
      this.setState({ step: 'ready' });
    }
  }

  componentDidMount() {
    const { invert, symbolSell, symbolBuy } = this.props;
  }

  render() {
    const { step, msg } = this.state;
    const { message, symbolBuy, symbolSell, invert } = this.props;

    // console.log(step);

    var text;
    switch (step) {
      case 'ready': text = [`Sell ${symbolSell} Buy ${symbolBuy}`]; break;
      case 'activated':
      case 'countingDown': text = ["Click again to confirm!"]; break;
      case 'sending': text = ["Sending trade!"]; break;
      case 'success': text = ["Success!", "Some shit!", "Some other shit!"]; break;
      case 'failure': text = ["Failure!", "Some shit!", "Some other shit!"]; break;
    }

    // console.log(text);

    return (
      <div className={`ex-sell-left-icon ${step}`} onClick={this.handleClick}>
        {invert && <i className="fas fa-caret-left"></i>}
        <div className={`ex-sell-left-text${text.length > 1 ? ` anim${text.length}` : ''}`}>
          {text.map((subtext, i) => <span key={i}>{subtext}</span>)}
        </div>
        {!invert && <i className="fas fa-caret-right"></i>}
      </div>
    );
  }
};




class ExchangeActionsRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectLeft: 1,
      selectRight: 2,
      amountLeft: 0,
      amountRight: 0
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const formatCrypto = crypto => {
      if (!crypto.id) return null;
      crypto = this.props.wallets.find(w => w.id == crypto.id);
      if (!crypto) return null;
      return $(`
      <div class="d-flex flex-column align-items-center justify-content-between select2crypto">
        <div class='left-right'>
          <p class="white fsx150 fbb"><img style="width: 20px; height: 20px; padding: 2px;" src="/assets/images/${crypto.iconm}"/>${crypto.name}</p>
          <p class="white fsx100 fb">${crypto.amount.toFixed(2)} ${crypto.symbol}</p>
        </div>
        <div class="left-right">
          <p class="white fsx100">${crypto.amountBTC.toFixed(2)} BTC</p>
          <p class="white fsx100 fb op6">${crypto.amountUSD.toFixed(2)} USD</p>
        </div>
      </div>`);
    };


    if (this.props.cryptoLeft.id != prevProps.cryptoLeft.id ||
      this.props.cryptoRight.id != prevProps.cryptoRight.id)
      this.setState({ amountLeft: 0, amountRight: 0 });
    

    if (!((prevProps || {}).wallets || {}).length || 
      this.props.cryptoLeft.id != prevProps.cryptoLeft.id ||
      this.props.cryptoRight.id != prevProps.cryptoRight.id ||
      this.props.cryptoLeft.amount != prevProps.cryptoLeft.amount ||
      this.props.cryptoRight.amount != prevProps.cryptoRight.amount ) {

      $('.cryptopicker:visible').select2({
        templateResult: formatCrypto,
        templateSelection: formatCrypto,
        dropdownParent: $('.ex-actions-row:visible')
      });

      $('.cryptopicker').off();
      $('.cryptopicker.left:visible').on("change", e => this.onSelectChange('selectLeft', 1)(e.target.value));
      $('.cryptopicker.right:visible').on("change", e => this.onSelectChange('selectRight', 2)(e.target.value));
      $('.cryptopicker').on("select2:open", () => 
    
      $('.select2-results').on("mousewheel touchstart touchmove touchend", function(e) {
        console.log('lel?')
        // e.preventDefault(); 
         e.stopPropagation(); 
       // return false;
      }));
    }
  }

  onSelectChange = (side, id) => value => this.props.changeCrypto(id)(parseInt(value));

  handleChangeQuantity = (side, otherSide, crypto, otherCrypto) => value => {
    if (!value)
      return this.setState({ amountLeft: 0, amountRight: 0 });
    const noComma = `${value}`.replace(/,/g, '.');
    const floatVal = parseFloat(noComma);
    if ((!!floatVal || floatVal === 0) && !/.*\..*\..*/.test(noComma)) {
      let trailingZeros = new RegExp(floatVal + "(\.0*)$").exec(noComma);
      trailingZeros = (trailingZeros && trailingZeros[1]) || "";
      this.setState({ [side]: parseFloat(noComma) + trailingZeros }, () => {
        if (crypto.rateUSD && otherCrypto.rateUSD)
          this.setState({
            [otherSide]: ((parseFloat(noComma) * crypto.rateUSD / otherCrypto.rateUSD) || 0).toPrecisionMy(4)
          });
      });
    }
  };

  quickPicks = ["BTC", "LTC", "XRP", "USD"];

  renderSelect = (addClass, side, value, otherCrypto, onSelectChange) => {
    const selectSide = (side == 'left' ? 'selectLeft' : 'selectRight');
    const selectId = (side == 'left' ? 1 : 2);

    const quickPicksIds = [0, 0, 0, 0]; let i;
    getCrypto().forEach(c => {
      if ((i = this.quickPicks.indexOf(c.symbol)) >= 0)
        quickPicksIds[i] = c.id;
    });

    return <div className={`${addClass} d-flex flex-column align-items-center justify-content-between select2crypto-around`}>
      <div className="left-right">
        <a className={`btn-quickpick noselect${[otherCrypto.id,value].includes(quickPicksIds[0]) ?' hidden-xs-up':''}`} onClick={() => onSelectChange(quickPicksIds[0])} >{this.quickPicks[0]}</a>
        <a className={`btn-quickpick noselect${[otherCrypto.id,value].includes(quickPicksIds[1]) ?' hidden-xs-up':''}`} onClick={() => onSelectChange(quickPicksIds[1])} >{this.quickPicks[1]}</a>
      </div>
              <div className="ex-crypto-list-container">
        <select className={`cryptopicker ${side}`} value={value}>
          {getCrypto().filter(crypto => crypto.id != otherCrypto.id && !(crypto.isFiat && otherCrypto.isFiat)).map((crypto, j) =>
            <option key={j} value={crypto.id}>
              {crypto.symbol} {crypto.name}
            </option>)}
        </select>
      </div>
      <div className="left-right">
        <a className={`btn-quickpick noselect${[otherCrypto.id,value].includes(quickPicksIds[2]) ?' hidden-xs-up':''}`} onClick={() => onSelectChange(quickPicksIds[2])} >{this.quickPicks[2]}</a>
        <a className={`btn-quickpick noselect${[otherCrypto.id,value].includes(quickPicksIds[3]) ?' hidden-xs-up':''}`} onClick={() => onSelectChange(quickPicksIds[3])} >{this.quickPicks[3]}</a>
      </div>
    </div>
  };

  renderAmount = (value, wallet, onChange) =>
    <div className="d-flex flex-column ex-input-container"><div className="left-right" style={{ width: "100%" }}>
      <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount*1.00).toPrecisionMy(4))} >100%</a>
      <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount*0.50).toPrecisionMy(4))} >50%</a>
    </div>
      <div>
        <p className="fsx150 fbb white text-center">Amount</p>
        <div className="d-flex flex-column ex-input-amount fsx150 fbb white">
          <input className="white" type="text" value={value}
            onChange={e => onChange(e.target.value)} />
          <span className="ex-input-title op6">{wallet.symbol}</span>
        </div></div>
      <div className="left-right" style={{ width: "100%" }}>
      <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount*0.25).toPrecisionMy(4))} >25%</a>
      <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount*0.10).toPrecisionMy(4))} >10%</a>
      </div>
    </div>

  render() {
    const {cryptoLeft, cryptoRight} = this.props;
    const {symbol: symbolLeft, id: idLeft} = cryptoLeft;
    const {symbol: symbolRight, id: idRight} = cryptoRight;

    return (
        <div className="row ex-actions-row w-100 h-100 d-flex align-items-center justify-content-between">

          {this.renderSelect("col-xl-3 col-6", "left", idLeft, cryptoRight, this.onSelectChange('selectLeft', 1))}
          {this.renderSelect("col-6 hidden-xl-up", "right", idRight, cryptoLeft, this.onSelectChange('selectRight', 2))}

          <div className="col-12 col-xl-6 ex-exchange p-0">
            {this.renderAmount(this.state.amountLeft, cryptoLeft, this.handleChangeQuantity('amountLeft', 'amountRight', cryptoLeft, cryptoRight))}

            <div className="ex-sell-container">
              <ExchangeArrow symbolBuy={symbolRight} symbolSell={symbolLeft} id="left-arrow" onLoadComplete={() => {
                console.log("load complete, sending order");
                console.log({
                  "orderType": "market",
                  "buyingCurrency": symbolRight,
                  "buyingQty": 1e10,
                  "sellingCurrency": symbolLeft,
                  "sellingQty": this.state.amountLeft
                });
                return this.props.sendOrder({
                  "orderType": "market",
                  "buyingCurrency": symbolRight,
                  "buyingQty": 1e10,
                  "sellingCurrency": symbolLeft,
                  "sellingQty": this.state.amountLeft
                });

              }} />
              <ExchangeArrow symbolBuy={symbolLeft} symbolSell={symbolRight} id="right-arrow" invert={true} onLoadComplete={() => {
                console.log("load complete, sending order");
                console.log({
                  "orderType": "market",
                  "buyingCurrency": symbolLeft,
                  "buyingQty": 1e10,
                  "sellingCurrency": symbolRight,
                  "sellingQty": this.state.amountRight
                });
                return this.props.sendOrder({
                  "orderType": "market",
                  "buyingCurrency": symbolLeft,
                  "buyingQty": 1e10,
                  "sellingCurrency": symbolRight,
                  "sellingQty": this.state.amountRight
                });

              }} />
            </div>

            {this.renderAmount(this.state.amountRight, cryptoRight, this.handleChangeQuantity('amountRight', 'amountLeft', cryptoRight, cryptoLeft))}
          </div>

          
          {this.renderSelect("col-3 hidden-lg-down", "right", idRight, cryptoLeft, this.onSelectChange('selectRight', 2))}
        </div>
    )
  }
}

export default ExchangeActionsRow;

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
      text: `Sell ${props.symbolSell} Buy ${props.symbolBuy}`,
      msg: null
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
        return this.setState({ step: 'sending' }, () => {
          clearTimeout(this.state.timer);
          this.props.onLoadComplete()
            .then(({ data }) => this.setState({ step: 'success', msg: data }, () => {
              this.state.timer = setTimeout(() => this.setState({ step: 'ready' }), 3000);
            }))
            .catch(({ data }) => this.setState({ step: 'failure', msg: data }, () => {
              this.state.timer = setTimeout(() => this.setState({ step: 'ready' }), 3000);
            }))
        });
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

  render() {
    const { step, msg } = this.state;
    const { message, symbolBuy, symbolSell, invert, id } = this.props;

    // console.log(step);

    var text;
    switch (step) {
      case 'ready': text = [`Sell ${symbolSell} Buy ${symbolBuy}`]; break;
      case 'activated':
      case 'countingDown': text = ["Click again to confirm!"]; break;
      case 'sending': text = ["Sending trade!"]; break;
      case 'success': text = ["Success!", `Sold ${this.state.msg.soldQty.toPrecisionMy(4)} ${symbolSell}`, `Bought ${this.state.msg.boughtQty.toPrecisionMy(4)} ${symbolBuy}`]; break;
      case 'failure': text = ["Failure!", `Error #211`, `Not enough margin!`]; break;
    }

    // console.log(text);

    return (
      <div className={`ex-sell-left-icon ${step} ${id}`} onClick={this.handleClick}>
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
      amountRight: 0,
      updateFun: null,
    }
  }

  componentWillReceiveProps() {
    if (this.state.updateFun)
      this.state.updateFun();
  }

  componentDidUpdate(prevProps) {
    const formatCrypto = crypto => {
      if (!crypto.id) return null;
      crypto = this.props.wallets.find(w => w.id == crypto.id);
      if (!crypto) return null;
      return $(`
      <div class="d-flex flex-column align-items-center justify-content-between select2crypto">
        <div class='left-right'>
        <p class="white fsx150 fbb"><img src="/assets/images/${crypto.iconm}"/>${crypto.name}</p>
        <p class="white fsx100 fb">${crypto.amount.toFixed(2)} ${crypto.symbol}</p>
        </div>
        <div class="left-right">
          <p class="white fsx100">${crypto.amountBTC.toFixed(2)} BTC</p>
          <p class="white fsx100 fb op6">${crypto.amountUSD.toFixed(2)} USD</p>
        </div>
      </div>`);
    };




    ///$('.cryptopicker:visible').val(null).trigger('change.select2');

    // if (!((this.props || {}).wallets || {}).length ||
    //   this.props.cryptoLeft.id != prevProps.cryptoLeft.id ||
    //   this.props.cryptoRight.id != prevProps.cryptoRight.id ||
    //   this.props.cryptoLeft.amount != prevProps.cryptoLeft.amount ||
    //   this.props.cryptoRight.amount != prevProps.cryptoRight.amount) {

    if (!this.selectOpen) {
      $('.cryptopicker:visible').select2({
        templateResult: formatCrypto,
        templateSelection: formatCrypto,
        dropdownParent: $('.ex-actions-row:visible')
      });

      $('.cryptopicker').off();
      $('.cryptopicker.left:visible').on("change", e => this.onSelectChange('selectLeft', 1)(e.target.value));
      $('.cryptopicker.right:visible').on("change", e => this.onSelectChange('selectRight', 2)(e.target.value));
      $('.cryptopicker').on("select2:open", () => {
        $('.select2-search input').prop('focus', false);
        this.selectOpen = true;
        $('.select2-results').on("mousewheel touchstart touchmove touchend", function (e) {
          // e.preventDefault(); 
          e.stopPropagation();
          // return false;
        })
      });
      $('.cryptopicker').on("select2:close", () => { this.selectOpen = false; });
    }
    // }
    //   else
    // $('.cryptopicker:visible').val(null).trigger('change.select2');
  }

  componentDidMount() {
    $('input.amountKeypad').keypad({ keypadClass: 'amountKeypad', keypadOnly: $(".exchange-section").innerWidth() < 500, closeText: "X", clearText: "C", layout: [$.keypad.SPACE + $.keypad.SPACE + $.keypad.CLOSE, '789', '456', '123', '.0' + $.keypad.CLEAR] });
    $('input.amountKeypad.left').on('change', e => this.handleChangeQuantity('amountLeft', 'amountRight', 'cryptoLeft', 'cryptoRight')(e.target.value));
    $('input.amountKeypad.right').on('change', e => this.handleChangeQuantity('amountRight', 'amountLeft', 'cryptoRight', 'cryptoLeft')(e.target.value));
  }

  onSelectChange = (side, id) => value => {
    // console.log('lol?');
    // console.log(this.state);
    this.setState({ amountLeft: 0, amountRight: 0, updateFun: null }, () => {
      // console.log('lel?');
      // console.log(this.state);
      this.props.changeCrypto(id)(parseInt(value))
    });

  }

  handleChangeQuantity = (side, otherSide, crypto, otherCrypto) => value => {
    // console.log("porco dio");
    // console.log(value);
    const noComma = `${value || 0}`.replace(/,/g, '.');
    const floatVal = parseFloat(noComma);
    if ((!!floatVal || floatVal === 0) && !/.*\..*\..*/.test(noComma)) {
      let trailingZeros = new RegExp(floatVal + "(\.0*)$").exec(noComma);
      trailingZeros = (trailingZeros && trailingZeros[1]) || "";
      this.setState({
        [side]: parseFloat(noComma) + trailingZeros,
        updateFun: () => this.handleChangeQuantity(side, otherSide, crypto, otherCrypto)(this.state[side])
      }, () => {
        if (this.props[crypto].rateUSD && this.props[otherCrypto].rateUSD)
          this.setState({
            [otherSide]: ((parseFloat(noComma) * this.props[crypto].rateUSD / this.props[otherCrypto].rateUSD) || 0).toPrecisionMy(4)
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

    const onSelectChangez = v => {
      if (![otherCrypto.id, value].includes(v))
        onSelectChange(v);
    }

    return <div className={`${addClass} d-flex flex-column align-items-center justify-content-between select2crypto-around`}>
      <div className="left-right hidden-xs-down">
        <a className={`btn-quickpick noselect${[otherCrypto.id, value].includes(quickPicksIds[0]) ? ' hidden-xs-u' : ''}`} onClick={() => onSelectChangez(quickPicksIds[0])} >{this.quickPicks[0]}</a>
        <a className={`btn-quickpick noselect${[otherCrypto.id, value].includes(quickPicksIds[1]) ? ' hidden-xs-u' : ''}`} onClick={() => onSelectChangez(quickPicksIds[1])} >{this.quickPicks[1]}</a>
      </div>
      <div className="ex-crypto-list-container">
        <select className={`cryptopicker ${side}`} value={value}>
          {getCrypto().filter(crypto => crypto.id != otherCrypto.id && !(crypto.isFiat && otherCrypto.isFiat)).map((crypto, j) =>
            <option key={j} value={crypto.id}>
              {crypto.symbol} {crypto.name}
            </option>)}
        </select>
      </div>
      <div className="left-right hidden-xs-down">
        <a className={`btn-quickpick noselect${[otherCrypto.id, value].includes(quickPicksIds[2]) ? ' hidden-xs-u' : ''}`} onClick={() => onSelectChangez(quickPicksIds[2])} >{this.quickPicks[2]}</a>
        <a className={`btn-quickpick noselect${[otherCrypto.id, value].includes(quickPicksIds[3]) ? ' hidden-xs-u' : ''}`} onClick={() => onSelectChangez(quickPicksIds[3])} >{this.quickPicks[3]}</a>
      </div>
    </div>
  };

  renderAmount = (value, wallet, onChange, side) =>
    <div className="d-flex flex-column ex-input-container"><div className="left-right" style={{ width: "100%" }}>
      <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount * 1.00).toPrecisionMy(4))} >100%</a>
      <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount * 0.50).toPrecisionMy(4))} >50%</a>
    </div>
      <div>
        <p className="fsx150 fbb white text-center">Amount</p>
        <div className="d-flex flex-column ex-input-amount fsx150 fbb white">
          <input className={`amountKeypad white ${side}`} type="text" value={value}
            onChange={e => { console.log('ay'); onChange(e.target.value); }} />
          <span className="ex-input-title op6">{wallet.symbol}</span>
        </div></div>
      <div className="left-right" style={{ width: "100%" }}>
        <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount * 0.25).toPrecisionMy(4))} >25%</a>
        <a className="btn-quickpick noselect" onClick={() => onChange((wallet.amount * 0.10).toPrecisionMy(4))} >10%</a>
      </div>
    </div>

  render() {
    const { cryptoLeft, cryptoRight } = this.props;
    const { symbol: symbolLeft, id: idLeft } = cryptoLeft;
    const { symbol: symbolRight, id: idRight } = cryptoRight;

    // console.log('ay');
    // console.log(this.state);

    return (
      <div className="row ex-actions-row w-100 h-100 d-flex align-items-center justify-content-between">

        {this.renderSelect("col-3 hidden-lg-down", "left", idLeft, cryptoRight, this.onSelectChange('selectLeft', 1))}

        <div className="col-xl-6 ex-exchange p-0">
          {this.renderAmount(this.state.amountLeft, cryptoLeft, this.handleChangeQuantity('amountLeft', 'amountRight', 'cryptoLeft', 'cryptoRight'), 'left')}

          <div className="ex-sell-container">
            <ExchangeArrow symbolBuy={symbolRight} symbolSell={symbolLeft} id="left" onLoadComplete={() => {
              console.log("load complete, sending order");
              console.log({
                "orderType": "market",
                "buyingCurrency": symbolRight,
                "buyingQty": 1e10,
                "sellingCurrency": symbolLeft,
                "sellingQty": this.state.amountLeft
              });
              this.setState({ amountLeft: 0, amountRight: 0, updateFun: null });
              return this.props.sendOrder({
                "orderType": "market",
                "buyingCurrency": symbolRight,
                "buyingQty": 1e10,
                "sellingCurrency": symbolLeft,
                "sellingQty": this.state.amountLeft
              });
            }} />
            <ExchangeArrow symbolBuy={symbolLeft} symbolSell={symbolRight} id="right" invert={true} onLoadComplete={() => {
              console.log("load complete, sending order");
              console.log({
                "orderType": "market",
                "buyingCurrency": symbolLeft,
                "buyingQty": 1e10,
                "sellingCurrency": symbolRight,
                "sellingQty": this.state.amountRight
              });
              this.setState({ amountLeft: 0, amountRight: 0, updateFun: null });
              return this.props.sendOrder({
                "orderType": "market",
                "buyingCurrency": symbolLeft,
                "buyingQty": 1e10,
                "sellingCurrency": symbolRight,
                "sellingQty": this.state.amountRight
              });
            }} />
          </div>

          {this.renderAmount(this.state.amountRight, cryptoRight, this.handleChangeQuantity('amountRight', 'amountLeft', 'cryptoRight', 'cryptoLeft'), 'right')}
        </div>


        {this.renderSelect("col-6 hidden-xl-up", "left", idLeft, cryptoRight, this.onSelectChange('selectLeft', 1))}
        {this.renderSelect("col-xl-3 col-6", "right", idRight, cryptoLeft, this.onSelectChange('selectRight', 2))}
      </div>
    )
  }
}

export default ExchangeActionsRow;

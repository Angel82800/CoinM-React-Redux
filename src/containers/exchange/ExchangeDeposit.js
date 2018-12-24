import React, { Component } from "react";

export default class ExchangeDeposit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            depositValue: "3463o2p315ioa0sdi124i",
            withdrawValue: "1.0",
            withdrawSymbol: "BTC",
            toValue: "89we9nwegmGD235aGSs",
        };
    }

    handleChangeDeposit = (event) => {
        this.setState({ depositValue: String(event.target.value) });
    };

    handleChangeWithdraw = (event) => {
        this.setState({ withdrawValue: Number(event.target.value) });
    };

    handleChangeTo = (event) => {
        this.setState({ withdrawSymbol: String(event.target.value) });
    };

    render() {
        const { depositValue, withdrawValue, withdrawSymbol, toValue } = this.state;

        return (
            <div className="deposit-container">
                <div className="deposit-row">
                    <div className="qr-container">
                        <img className="qr" src="assets/images/qr-blue.png"/>
                    </div>
                    <div className="deposit-input-container">
                        <div className="input">
                            <span>Deposit here</span>
                            <input type="text" name="deposit" value={depositValue} onChange={this.handleChangeDeposit}/>
                            <i className="fa fa-clipboard" aria-hidden="true"/>
                        </div>
                    </div>
                </div>
                <div className="withdraw-row">
                    <div className="to-container">
                        <div><span>Withdraw</span></div>
                        <div><span>to:</span></div>
                    </div>

                    <div className="withdraw-inputs-container">
                        <div className="input">
                            <input type="text" name="deposit" value={withdrawValue} onChange={this.handleChangeWithdraw}/>
                            <div className="symbol-container">{withdrawSymbol}</div>
                            <div className="int">
                                <i className="fa fa-caret-up" aria-hidden="true" data="fiat" onClick={this.handleIncrease}/>
                                <i className="fa fa-caret-down" aria-hidden="true" data="fiat" onClick={this.handleDecrease}/>
                            </div>
                        </div>

                        <div className="input second">
                            <input type="text" name="deposit" value={toValue} onChange={this.handleChangeTo}/>
                        </div>
                    </div>

                    <div className="withdraw-submit-container">
                        <button>GO!</button>
                    </div>
                </div>
            </div>
        )
    }
}

import React, { Component } from "react";
import { connect } from "react-redux";
import formSerialize from "form-serialize";

const accents = require("remove-accents");

import { KycActions } from "../../redux/app/actions";
import SelectCountries from "../../components/Profile/SelectCountries";
import SelectPhoneCodes from "../../components/Profile/SelectPhoneCodes";

let SHA3 = require("crypto-js/sha3");

const supportedFiat = [{"name":"UAE Dirham","symbol":"AED"},{"name":"Afghani","symbol":"AFN"},{"name":"Lek","symbol":"ALL"},{"name":"Armenian Dram","symbol":"AMD"},{"name":"Netherlands Antillean Guilder","symbol":"ANG"},
{"name":"Kwanza","symbol":"AOA"},{"name":"Argentine Peso","symbol":"ARS"},{"name":"Australian Dollar","symbol":"AUD"},{"name":"Aruban Florin","symbol":"AWG"},{"name":"Azerbaijan Manat","symbol":"AZN"},{"name":"Convertible Mark","symbol":"BAM"},
{"name":"Barbados Dollar","symbol":"BBD"},{"name":"Taka","symbol":"BDT"},{"name":"Bulgarian Lev","symbol":"BGN"},{"name":"Bahraini Dinar","symbol":"BHD"},{"name":"Burundi Franc","symbol":"BIF"},{"name":"Bermudian Dollar","symbol":"BMD"},
{"name":"Brunei Dollar","symbol":"BND"},{"name":"Boliviano","symbol":"BOB"},{"name":"Brazilian Real","symbol":"BRL"},{"name":"Bahamian Dollar","symbol":"BSD"},{"name":"Ngultrum","symbol":"BTN"},{"name":"Pula","symbol":"BWP"},
{"name":"Belarusian Ruble","symbol":"BYN"},{"name":"Belize Dollar","symbol":"BZD"},{"name":"Canadian Dollar","symbol":"CAD"},{"name":"Congolese Franc","symbol":"CDF"},{"name":"Swiss Franc","symbol":"CHF"},{"name":"Unidad de Fomento","symbol":"CLF"},
{"name":"Chilean Peso","symbol":"CLP"},{"name":"Yuan Renminbi","symbol":"CNY"},{"name":"Colombian Peso","symbol":"COP"},{"name":"Costa Rican Colon","symbol":"CRC"},{"name":"Peso Convertible","symbol":"CUC"},{"name":"Cuban Peso","symbol":"CUP"}
,{"name":"Cabo Verde Escudo","symbol":"CVE"},{"name":"Czech Koruna","symbol":"CZK"},{"name":"Djibouti Franc","symbol":"DJF"},{"name":"Danish Krone","symbol":"DKK"},{"name":"Dominican Peso","symbol":"DOP"},{"name":"Algerian Dinar","symbol":"DZD"},
{"name":"Egyptian Pound","symbol":"EGP"},{"name":"Nakfa","symbol":"ERN"},{"name":"Ethiopian Birr","symbol":"ETB"},{"name":"Euro","symbol":"EUR"},{"name":"Fiji Dollar","symbol":"FJD"},{"name":"Falkland Islands Pound","symbol":"FKP"},
{"name":"Pound Sterling","symbol":"GBP"},{"name":"Lari","symbol":"GEL"},{"name":"Ghana Cedi","symbol":"GHS"},{"name":"Gibraltar Pound","symbol":"GIP"},{"name":"Dalasi","symbol":"GMD"},{"name":"Guinean Franc","symbol":"GNF"},
{"name":"Quetzal","symbol":"GTQ"},{"name":"Guyana Dollar","symbol":"GYD"},{"name":"Hong Kong Dollar","symbol":"HKD"},{"name":"Lempira","symbol":"HNL"},{"name":"Kuna","symbol":"HRK"},{"name":"Gourde","symbol":"HTG"},
{"name":"Forint","symbol":"HUF"},{"name":"Rupiah","symbol":"IDR"},{"name":"New Israeli Sheqel","symbol":"ILS"},{"name":"Indian Rupee","symbol":"INR"},{"name":"Iraqi Dinar","symbol":"IQD"},{"name":"Iranian Rial","symbol":"IRR"},
{"name":"Iceland Krona","symbol":"ISK"},{"name":"Jamaican Dollar","symbol":"JMD"},{"name":"Jordanian Dinar","symbol":"JOD"},{"name":"Yen","symbol":"JPY"},{"name":"Kenyan Shilling","symbol":"KES"},{"name":"Som","symbol":"KGS"},
{"name":"Riel","symbol":"KHR"},{"name":"Comorian Franc ","symbol":"KMF"},{"name":"North Korean Won","symbol":"KPW"},{"name":"Won","symbol":"KRW"},{"name":"Kuwaiti Dinar","symbol":"KWD"},{"name":"Cayman Islands Dollar","symbol":"KYD"},
{"name":"Tenge","symbol":"KZT"},{"name":"Lao Kip","symbol":"LAK"},{"name":"Lebanese Pound","symbol":"LBP"},{"name":"Sri Lanka Rupee","symbol":"LKR"},{"name":"Liberian Dollar","symbol":"LRD"},{"name":"Loti","symbol":"LSL"},
{"name":"Libyan Dinar","symbol":"LYD"},{"name":"Moroccan Dirham","symbol":"MAD"},{"name":"Moldovan Leu","symbol":"MDL"},{"name":"Malagasy Ariary","symbol":"MGA"},{"name":"Denar","symbol":"MKD"},{"name":"Kyat","symbol":"MMK"},
{"name":"Tugrik","symbol":"MNT"},{"name":"Pataca","symbol":"MOP"},{"name":"Mauritius Rupee","symbol":"MUR"},{"name":"Rufiyaa","symbol":"MVR"},{"name":"Malawi Kwacha","symbol":"MWK"},{"name":"Mexican Peso","symbol":"MXN"},
{"name":"Malaysian Ringgit","symbol":"MYR"},{"name":"Mozambique Metical","symbol":"MZN"},{"name":"Namibia Dollar","symbol":"NAD"},{"name":"Naira","symbol":"NGN"},{"name":"Cordoba Oro","symbol":"NIO"},{"name":"Norwegian Krone","symbol":"NOK"},
{"name":"Nepalese Rupee","symbol":"NPR"},{"name":"New Zealand Dollar","symbol":"NZD"},{"name":"Rial Omani","symbol":"OMR"},{"name":"Balboa","symbol":"PAB"},{"name":"Sol","symbol":"PEN"},{"name":"Kina","symbol":"PGK"},
{"name":"Philippine Piso","symbol":"PHP"},{"name":"Pakistan Rupee","symbol":"PKR"},{"name":"Zloty","symbol":"PLN"},{"name":"Guarani","symbol":"PYG"},{"name":"Qatari Rial","symbol":"QAR"},{"name":"Romanian Leu","symbol":"RON"},
{"name":"Serbian Dinar","symbol":"RSD"},{"name":"Russian Ruble","symbol":"RUB"},{"name":"Rwanda Franc","symbol":"RWF"},{"name":"Saudi Riyal","symbol":"SAR"},{"name":"Solomon Islands Dollar","symbol":"SBD"},{"name":"Seychelles Rupee","symbol":"SCR"},
{"name":"Sudanese Pound","symbol":"SDG"},{"name":"Swedish Krona","symbol":"SEK"},{"name":"Singapore Dollar","symbol":"SGD"},{"name":"Saint Helena Pound","symbol":"SHP"},{"name":"Leone","symbol":"SLL"},{"name":"Somali Shilling","symbol":"SOS"},
{"name":"Surinam Dollar","symbol":"SRD"},{"name":"El Salvador Colon","symbol":"SVC"},{"name":"Syrian Pound","symbol":"SYP"},{"name":"Lilangeni","symbol":"SZL"},{"name":"Baht","symbol":"THB"},{"name":"Somoni","symbol":"TJS"},
{"name":"Turkmenistan New Manat","symbol":"TMT"},{"name":"Tunisian Dinar","symbol":"TND"},{"name":"Pa\'anga","symbol":"TOP"},{"name":"Turkish Lira","symbol":"TRY"},{"name":"Trinidad and Tobago Dollar","symbol":"TTD"},{"name":"New Taiwan Dollar","symbol":"TWD"},
{"name":"Tanzanian Shilling","symbol":"TZS"},{"name":"Hryvnia","symbol":"UAH"},{"name":"Uganda Shilling","symbol":"UGX"},{"name":"US Dollar","symbol":"USD"},{"name":"Peso Uruguayo","symbol":"UYU"},{"name":"Uzbekistan Sum","symbol":"UZS"},
{"name":"Bolívar","symbol":"VEF"},{"name":"Dong","symbol":"VND"},{"name":"Vatu","symbol":"VUV"},{"name":"Tala","symbol":"WST"},{"name":"CFA Franc BEAC","symbol":"XAF"},{"name":"Silver","symbol":"XAG"},{"name":"Gold","symbol":"XAU"},
{"name":"East Caribbean Dollar","symbol":"XCD"},{"name":"SDR (Special Drawing Right)","symbol":"XDR"},{"name":"CFA Franc BCEAO","symbol":"XOF"},{"name":"CFP Franc","symbol":"XPF"},{"name":"Yemeni Rial","symbol":"YER"},{"name":"Rand","symbol":"ZAR"},
{"name":"Zambian Kwacha","symbol":"ZMW"},{"name":"Zimbabwe Dollar","symbol":"ZWL"}];

const supportedCrypto = [{"name":"Bitcoin","symbol":"BTC"},{"name":"Litecoin","symbol":"LTC"},{"name":"XRP","symbol":"XRP"},{"name":"Dogecoin","symbol":"DOGE"},{"name":"DigiByte","symbol":"DGB"},{"name":"ReddCoin","symbol":"RDD"},
{"name":"Dash","symbol":"DASH"},{"name":"MonaCoin","symbol":"MONA"},{"name":"MaidSafeCoin","symbol":"MAID"},{"name":"Monero","symbol":"XMR"},{"name":"Bytecoin","symbol":"BCN"},{"name":"BitShares","symbol":"BTS"},
{"name":"Stellar","symbol":"XLM"},{"name":"Emercoin","symbol":"EMC"},{"name":"Verge","symbol":"XVG"},{"name":"Tether","symbol":"USDT"},{"name":"NEM","symbol":"XEM"},{"name":"Ethereum","symbol":"ETH"},{"name":"Siacoin","symbol":"SC"},
{"name":"Factom","symbol":"FCT"},{"name":"Augur","symbol":"REP"},{"name":"Decred","symbol":"DCR"},{"name":"PIVX","symbol":"PIVX"},{"name":"Lisk","symbol":"LSK"},{"name":"DigixDAO","symbol":"DGD"},{"name":"Steem","symbol":"STEEM"},
{"name":"Waves","symbol":"WAVES"},{"name":"Ardor","symbol":"ARDR"},{"name":"Ethereum Classic","symbol":"ETC"},{"name":"Stratis","symbol":"STRAT"},{"name":"NEO","symbol":"NEO"},{"name":"ZCoin","symbol":"XZC"},{"name":"Zcash","symbol":"ZEC"},
{"name":"Golem","symbol":"GNT"},{"name":"Maker","symbol":"MKR"},{"name":"Komodo","symbol":"KMD"},{"name":"Nano","symbol":"NANO"},{"name":"Ark","symbol":"ARK"},{"name":"Qtum","symbol":"QTUM"},{"name":"Basic Attention Token","symbol":"BAT"},
{"name":"ZenCash","symbol":"ZEN"},{"name":"Aeternity","symbol":"AE"},{"name":"Veritaseum","symbol":"VERI"},{"name":"IOTA","symbol":"MIOTA"},{"name":"Bancor","symbol":"BNT"},{"name":"GXChain","symbol":"GXS"},{"name":"FunFair","symbol":"FUN"},
{"name":"Status","symbol":"SNT"},{"name":"EOS","symbol":"EOS"},{"name":"MCO","symbol":"MCO"},{"name":"Gas","symbol":"GAS"},{"name":"Populous","symbol":"PPT"},{"name":"OmiseGO","symbol":"OMG"},{"name":"Ethos","symbol":"ETHOS"},
{"name":"Bitcoin Cash","symbol":"BCH"},{"name":"Binance Coin","symbol":"BNB"},{"name":"Bytom","symbol":"BTM"},{"name":"Dentacoin","symbol":"DCN"},{"name":"0x","symbol":"ZRX"},{"name":"Hshare","symbol":"HSR"},
{"name":"VeChain","symbol":"VEN"},{"name":"Nebulas","symbol":"NAS"},{"name":"Waltonchain","symbol":"WTC"},{"name":"Loopring","symbol":"LRC"},{"name":"TRON","symbol":"TRX"},{"name":"Decentraland","symbol":"MANA"},
{"name":"Kyber Network","symbol":"KNC"},{"name":"Kin","symbol":"KIN"},{"name":"Cardano","symbol":"ADA"},{"name":"Tezos","symbol":"XTZ"},{"name":"RChain","symbol":"RHOC"},{"name":"Cryptonex","symbol":"CNX"},
{"name":"Enigma","symbol":"ENG"},{"name":"Aion","symbol":"AION"},{"name":"Bitcoin Gold","symbol":"BTG"},{"name":"KuCoin Shares","symbol":"KCS"},{"name":"Nuls","symbol":"NULS"},{"name":"ICON","symbol":"ICX"},
{"name":"Power Ledger","symbol":"POWR"},{"name":"Paypex","symbol":"PAYX"},{"name":"QASH","symbol":"QASH"},{"name":"Bitcoin Diamond","symbol":"BCD"},{"name":"CyberMiles","symbol":"CMT"},{"name":"aelf","symbol":"ELF"},
{"name":"WAX","symbol":"WAX"},{"name":"Mixin","symbol":"XIN"},{"name":"MOAC","symbol":"MOAC"},{"name":"IOST","symbol":"IOST"},{"name":"Zilliqa","symbol":"ZIL"},{"name":"Elastos","symbol":"ELA"},{"name":"Polymath","symbol":"POLY"},
{"name":"Huobi Token","symbol":"HT"},{"name":"Ontology","symbol":"ONT"},{"name":"Bitcoin Private","symbol":"BTCP"},{"name":"Loom Network","symbol":"LOOM"},{"name":"Dropil","symbol":"DROP"},{"name":"Pundi X","symbol":"NPXS"},
{"name":"Wanchain","symbol":"WAN"},{"name":"Mithril","symbol":"MITH"},{"name":"Cortex","symbol":"CTXC"}];


class ReferenceProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateStatus: "",
            updateSuccess: true,
            validAddress: true
        };
    }

    componentDidMount() {
        this.props.verifyChecking({
            token: this.props.userToken,
            cb: null
        });

        const formatCountry = state => {
            if (!state.id || state.text.indexOf("Searching") > -1) {
                return state.text;
            }

            return $("<img width='30' height='auto' src='../../assets/images/flags_small/"
                + accents.remove(state.text).replace(/ /g, "_").toLowerCase() + ".gif'/>"
                + "<span class='pl-2'>" + state.text + "</span>");
        };

        const formatPhone = state => {
            if (!state.id || state.text.indexOf("Searching") > -1) {
                return state.text;
            }

            const splitText = state.text.split("|");

            return $("<img width='30' height='auto' src='../../assets/images/flags_small/"
                + accents.remove(splitText[0]).replace(/ /g, "_").toLowerCase() + ".gif'/>"
                + "<span class='pl-2'>" + state.id + " (+" + splitText[1] + ")</span>");
        };

        $(".countrypicker").select2({
            templateResult: formatCountry,
            templateSelection: formatCountry
        });

        $(".phonepicker").select2({
            templateResult: formatPhone,
            templateSelection: formatPhone
        });

        
        $(".fiatpicker").select2({});
        $(".cryptopicker").select2({});
    }


    onSubmit = (e) => {
        e.preventDefault();

        let data = formSerialize(e.target, { hash: true, empty: true });
        if (data.ethAddress && !this.isAddress(data.ethAddress.trim())) {
            this.setState({
                validAddress: false
            });
            return false;
        } else {
            this.setState({
                validAddress: true
            });
        }

        this.setState({
            updateStatus: "",
            updateSuccess: false
        });

        if (data.phoneCountry) {
            data.phoneCode = this.phoneCodes.getPhoneCode(data.phoneCountry);
        }

        this.props.updateProfile({
            data,
        }).then(() => {
            this.setState({
                updateStatus: "Profile is updated successfully.",
                updateSuccess: true
            });
        }).catch(error => {
            this.setState({
                updateStatus: error && error.message,
                updateSuccess: false
            });
        });
    };

    isAddress = (address) => {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            // Check if it has the basic requirements of an address
            return false;
        } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
            // If it's all small caps or all all caps, return true
            return true;
        } else {
            // Otherwise check each case
            return this.isChecksumAddress(address);
        }
    };

    isChecksumAddress = (address) => {
        // Check each case
        address = address.replace("0x", "");
        let addressHash = this.sha3(address.toLowerCase());

        for (let i = 0; i < 40; i++) {
            // The nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
                (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }

        return true;
    };

    sha3 = (value) => {
        return SHA3(value, {
            outputLength: 256
        }).toString();
    };

    render() {
        return (
            <form id="profileForm" method="POST" onSubmit={this.onSubmit}>
                <div className="ga-sec-content">
                    <div className="row ga-auth" id="ga-auth-settings">
                        <div className="col-md-6 pt-4 pl-md-0">
                            <div className="ga-sec-auth-title">
                                <span>Personal Information</span>
                            </div>

                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="username">Username</label>*/}
                                {/*<div className="ga-posr">*/}
                                    {/*<input type="text" className="form-control" name="username" defaultValue={this.props.userData.username}/>*/}
                                {/*</div>*/}
                            {/*</div>*/}

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="firstname">Full Name</label>
                                        <div className="ga-posr">
                                            <input type="text" name="firstname" className="form-control" placeholder="First Name"
                                                   defaultValue={this.props.userData.firstname} readOnly={!!this.props.userData.firstname}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="lastname">&nbsp;</label>
                                        <div className="ga-posr">
                                            <input type="text" name="lastname" className="form-control" placeholder="Last Name"
                                                   defaultValue={this.props.userData.lastname} readOnly={!!this.props.userData.lastname}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <SelectCountries
                                residence={this.props.userData.residence}
                                citizenship={this.props.userData.citizenship}
                                accredited={this.props.userData.accredited}
                            />

                            {this.props.kycStatus === "success"
                                ? (<b>VERIFICATION SUCCESSFUL!</b>)
                                : (
                                    <div className="row d-flex justify-content-center">
                                        <a href="#/kyc" className="btn btn-round secondary">
                                            <b className="text-white">
                                                {this.props.kycStatus === "none" ? "GET VERIFIED!" : "CHECK VERIFICATION STATUS!"}
                                            </b>
                                        </a>
                                    </div>
                                )
                            }

                            <div className="row"/>

                            <div className="row mt-5">
                                <div className="col-md-12 text-center" style={{ lineHeight: "50px" }}>
                                    <button type="submit" className="btn btn-round primary">SAVE<b className="hidden-sm-down"> CHANGES</b></button>
                                    <button type="reset" className="ml-1 btn btn-round primary">RESET<b className="hidden-sm-down"> CHANGES</b></button>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className={"col-md-12 text-center " + (this.state.updateSuccess ? "text-success" : "text-danger")}>
                                    {this.state.updateStatus}
                                </div>
                            </div>

                        </div>

                        <div className="col-md-6 pt-4 pr-md-0">
                            {/*
                            <div className="ga-sec-auth-title">
                                <span>Balance Information</span>
                            </div>

                            <div className="d-flex flex-column justify-content-center">
                                <div className="position-relative p-5 border-purple-3 border-radius-1">
                                    <img className="warning" src="assets/images/warning.png"/>
                                    <div className="text-small font-weight-medium color-purple-1 text-justify">
                                        <span className="text-warning">ATTENTION:&nbsp;</span>
                                        Regardless of how you are making your purchase an ETH wallet is needed to link to the smart
                                        contract that is in control of the COIN (XCM) token distribution. This wallet will be where
                                        we'll distribute your COIN should you choose to withdraw it from our platform once it has
                                        been minted and is ready for distribution, shortly following the close of our main token sale
                                        in late March of 2018. <b>Do not register a wallet address from an exchange</b> (Kraken,
                                        Poloniex, Coinbase, etc.) Be sure to enter the address of a wallet that allows you to be interact
                                        with ERC20 token contracts such as
                                        &nbsp;<a href="https://www.myetherwallet.com/" target="_blank"><b>EtherWallet</b></a>,&nbsp;
                                        <a href="https://www.parity.io/" target="_blank"><b>Parity</b></a>&nbsp;or&nbsp;
                                        <a href="https://metamask.io/" target="_blank"><b>MetaMask</b></a>.
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="eth_address">ETH Address</label>
                                <div className="ga-posr">
                                    <input type="text" className="form-control" name="ethAddress" defaultValue={this.props.userData.ethAddress}/>
                                    <span className={"text-danger" + (this.state.validAddress ? " hidden-xs-up" : "")}>Invalid Ethereum Address</span>
                                </div>
                            </div>

                            <br/>
                            */}

                            <div className="ga-sec-auth-title m-t-0">
                                <span>Contact Information</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="ga-posr">
                                    <input type="email" className="form-control" name="email" defaultValue={this.props.userData.email} disabled/>
                                </div>
                            </div>

                            <SelectPhoneCodes
                                ref={ref => this.phoneCodes = ref}
                                phoneCode={this.props.userData.phoneCode}
                                phoneCountry={this.props.userData.phoneCountry}
                                phone={this.props.userData.phone}
                            />

                            <div className="ga-sec-auth-title m-t-0">
                                <span>Exchange Preferences</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Preferred fiat currency: <p className="text-small capitalize">This fiat currency will be used to express the total value of the balance</p></label>
                                <select name="balanceFiat" className="fiatpicker" defaultValue={this.props.userData.balanceFiat || "EUR"}>
                                    {supportedFiat.map((fiat, i) => <option key={i} value={fiat.symbol}>{fiat.name} ({fiat.symbol})</option>)}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Preferred crypto currency: <p className="text-small capitalize">This fiat currency will be used to express the total value of the balance</p></label>
                                <select name="balanceCrypto" className="cryptopicker" defaultValue={this.props.userData.balanceCrypto || "BTC"}>
                                    {supportedCrypto.map((crypto, i) => <option key={i} value={crypto.symbol}>{crypto.name} ({crypto.symbol})</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userToken: state.userReducer.userToken,
        kycStatus: state.kycReducer.status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyChecking: (req) => dispatch(KycActions.verifyChecking(req.token, req.cb))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceProfile);

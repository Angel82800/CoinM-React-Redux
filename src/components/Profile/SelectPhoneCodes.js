import React, {Component} from 'react'; 
const countries = require('../../../node_modules/countries-list/dist/countries.json');

export default class SelectPhoneCodes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phoneCountry: props.phoneCountry
        };
    }

    componentWillMount() {
        if (!this.state.phoneCountry) {
            for (let countryCode in countries) {
                if (countryCode === "BV" || countryCode === "HM") {
                    continue;
                }

                if (parseInt(this.getPhoneCode(countryCode)) === this.props.phoneCode) {
                    this.setState({
                        phoneCountry: countryCode
                    });
                    break;
                }
            }
        }
    }

    getPhoneCode = countryCode => {
        let phoneCode = countries[countryCode].phone;

        if (countryCode === "BQ" || countryCode === "CW") {
            phoneCode = "599";
        }

        if (countryCode === "CC") {
            phoneCode = "891";
        }

        if (countryCode === "DO") {
            phoneCode = "1";
        }

        if (countryCode === "KZ") {
            phoneCode = "7";
        }

        if (countryCode === "SJ") {
            phoneCode = "47";
        }

        if (countryCode === "VA") {
            phoneCode = "379";
        }

        if (countryCode === "XK") {
            phoneCode = "383";
        }

        if (phoneCode.length > 3) {
            phoneCode = "1";
        }

        return phoneCode;
    };

    getCountryList = () => {
        let result = [];
        let j = 0;

        for (let countryCode in countries) {
            if (countryCode === "BV" || countryCode === "HM") {
                continue;
            }

            result.push(
                <option key={j++} value={countryCode}>
                    {`${countries[countryCode].name}|${this.getPhoneCode(countryCode)}`}
                </option>
            );
        }

        return result;
    };

    checkNumeric = () => {
        const phoneField = this.refs.phoneInput;
        if (phoneField.value) {
            phoneField.value = phoneField.value.toString().match(/[0-9]/g).reduce((a, b) => (a + b), "");
        }
    };

    render() {
        return (
            <div className="form-group">
                <label htmlFor="phone" className="d-block">
                    Phone
                </label>

                <div className="ga-posr">
                    <div className="ga-custom-flag d-flex justify-content-center align-items-center">
                        <select className="form-control phonepicker" name="phoneCountry" defaultValue={this.state.phoneCountry}>
                            {this.getCountryList()}
                        </select>

                        <input ref="phoneInput" type="text" name="phone" defaultValue={this.props.phone}
                               className="form-control ga-custom-phone-input border-0" onChange={this.checkNumeric}/>
                    </div>
                </div>
            </div>
        );
    }
}

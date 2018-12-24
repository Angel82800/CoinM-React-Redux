import React, { Component } from "react";
import { AccountActions } from "../../redux/app/actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class GoOpt extends Component {
    closePopup = (optIn) => {
        this.props.setOptIn({
            token: this.props.userToken,
            data: { optIn: optIn }
        });
    };

    render() {
        return (
            <div className={"go-popup-container" + (this.props.userData.optIn === undefined ? "" :  " d-none")}>
                <div className="go-popup">
                    <img className="go-policy-icon" src="assets/img/policy-icon.svg" alt=""/>

                    <div className="go-policy-content">
                        <h2>We're Updating our Privacy Policy</h2>

                        <p>You're at the heart of everything we're building here at CoinMetro, as a result, the security of your
                            data and protecting your privacy are always our primary concern. Your data is extremely precious, we
                            only use it to verify your identity, enable transactions, and improve our product offering. We do not -
                            and will not - sell your data to third parties.</p>

                        <p>As we operate in the financial services space, we adhere to the regulatory requirements that address data
                            protection and privacy. In order to support the latest European data privacy law (GDPR), we're making
                            some changes to our Privacy Policy and Terms of Use. These updates will take effect on May 25th,
                            2018.</p>

                        <p className="go-policy-title">The main aim of the changes are to:</p>

                        <p><strong>Improve the transparency of the data we collect - making it easier for you to understand what
                            information we collect, why we collect it, how we use it, and reveal any third parties we share it with
                            (e.g. our banking partners).</strong></p>

                        <p>GDPR requires that you "opt-in" to continue receiving emails from us, including product updates,
                            promotions, and referral opportunities. What is your preference?</p>
                    </div>

                    <div className="go-policy-buttons">
                        <div className="go-button-violet" onClick={() => this.closePopup(true)}>
                            <i className="far fa-check go-button-f-icon"/><span>Yes, I'd like to opt-in</span>
                        </div>
                        <div className="go-button-white" onClick={() => this.closePopup(false)}>
                            <i className="far fa-times go-button-f-icon"/><span>No, I'd like to opt-out</span>
                        </div>
                    </div>

                    <div className="go-policy-footer">
                        <span>To learn more about our products and policies, please <a href="https://www.coinmetro.com/" target="_blank">check our website</a>. If you have any questions about this or any other aspect of our services, please don't hesitate to <a
                            href="https://www.coinmetro.com/contact.html" target="_blank">get in touch</a> with our customer support team.</span>
                    </div>
                </div>
            </div>
        );
    }
}

GoOpt.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        userToken: state.userReducer.userToken,
        userData: state.userReducer.userData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setOptIn: (req) => dispatch(AccountActions.setOptIn(req.token, req.data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GoOpt);


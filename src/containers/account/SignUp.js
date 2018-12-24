import React, { Component } from "react";
import PropTypes from "prop-types";
import { Cookies } from "react-cookie";
import Toggle from "material-ui/Toggle";
import { connect } from "react-redux";
import formSerialize from "form-serialize";

import APPCONFIG from "../../constants/Config";
import { AccountActions } from "../../redux/app/actions";
import LoadingOverlay from "../../components/Common/LoadingOverlay/index";
import { getSubData } from "../../constants/Helpers";

class SignUp extends Component {
    constructor(props) {
        super(props);

        // check for referral
        const cookies = new Cookies;
        const refId = cookies.get("refId");

        this.state = {
            brand: APPCONFIG.brand,
            refId,
            emailOK: false,
            pass6chars: false,
            passUcase: false,
            passLcase: false,
            passDigit: false,
            passMatch: false
        };
    }

    signUp = (e) => {
        e.preventDefault();

        const formData = formSerialize(e.target, { hash: true });
        const sub_data = getSubData();
        if (sub_data) {
            formData.sub_data = sub_data;
        }

        if (formData["password"] !== formData["confirm-password"]) {
            this.props.signUpError("Password and Confirm Password does not match.");
        } else {
            // check for referral
            const cookies = new Cookies;

            this.props.signUp({
                data: formData
            }).then(() => {
                if (cookies.get("refId")) // unset referral cookie
                    cookies.remove("refId");

                this.context.router.push("/account/confirm");
            });

            this.props.signUpErrorReset();
        }
    };

    cleanupErrors = () => {
        if (this.props.error) {
            this.props.signUpErrorReset();
        }
    };

    passwordCheck = (e) => {
        this.setState({
            pass6chars: e.target.value.length >= 6,
            passUcase: !!e.target.value.match(/[A-Z]/),
            passLcase: !!e.target.value.match(/[a-z]/),
            passDigit: !!e.target.value.match(/[0-9]/),
        });
        this.cleanupErrors();
    };

    confirmPasswordCheck = (e) => {
        this.setState({
            passMatch: e.target.value == $("#password")[0].value
        });
        this.cleanupErrors();
    };

    emailCheck = (e) => {
        this.setState({
            emailOK: !!e.target.value.match(/^.*@[A-Za-z0-9\-]*\.[A-Za-z]{2,3}$/)
        });
        this.cleanupErrors();
    };

    render() {
        const { pass6chars, passUcase, passLcase, passDigit, passMatch, emailOK } = this.state;

        const purple1 = "#9f8bc9";
        return (
            <div className="card bg-white">
                <LoadingOverlay overlayClass={(this.props.loading) ? "overlay show" : "overlay"} message=""/>

                <form className="form-horizontal" method="POST" onSubmit={(e) => this.signUp(e)}>
                    <div className="card-content ph-60">
                        <div className="onboarding-text">
                            <section className="logo text-center">
                                <h4 className="mb-4 auth-title">Use the form below to get on the train</h4>
                            </section>

                            <hr/>
                        </div>

                        <fieldset className="mb-3">
                            <div className="form-group">
                                <span className="text-danger">{this.props.error}</span>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6 first-name">
                                        <label htmlFor="firstname">First Name</label>
                                        <input type="firstname" className="primary" id="firstname" name="firstname"
                                               onChange={this.cleanupErrors} placeholder="First Name" required/>
                                    </div>

                                    <div className="col-md-6 last-name">
                                        <label htmlFor="lastname">Last Name</label>
                                        <input type="lastname" className="primary" id="lastname" name="lastname"
                                               onChange={this.cleanupErrors} placeholder="Last Name" required/>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email
                                    {emailOK
                                        ? <a className="fa fa-check" style={{ color: "green" }}/>
                                        : <a className="fa fa-times" style={{ color: "red" }}/>
                                    }
                                </label>
                                <input type="email" className="primary" id="email" name="email"
                                       onChange={(e) => this.emailCheck(e)} placeholder="Enter your Email Address" required/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password
                                    {(pass6chars && passUcase && passLcase && passDigit)
                                        ? <a className="fa fa-check" style={{ color: "green" }}/>
                                        : <a className="fa fa-times" style={{ color: "red" }}/>
                                    }
                                </label>

                                <input type="password" className="primary" id="password" name="password"
                                       onChange={(e) => this.passwordCheck(e)} placeholder="Choose your password" required/>

                                <a className="text-small" style={{ color: pass6chars ? "green" : purple1 }}>At least 6 characters</a>,
                                <a className="text-small" style={{ color: passUcase ? "green" : purple1 }}>1 UPPERCASE</a>,
                                <a className="text-small" style={{ color: passLcase ? "green" : purple1 }}>1 lowercase</a>,
                                <a className="text-small" style={{ color: passDigit ? "green" : purple1 }}>1 d1g1t</a>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password
                                    {passMatch
                                        ? <a className="fa fa-check" style={{ color: "green" }}>It's a match!</a>
                                        : <a className="fa fa-times" style={{ color: "red" }}/>
                                    }
                                </label>
                                <input type="password" className="primary" id="confirm-password" name="confirm-password"
                                       onChange={(e) => this.confirmPasswordCheck(e)} placeholder="Same as above" required/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="refId">Referral Code (*optional)</label>
                                <input type="text"
                                       className="primary"
                                       id="refId"
                                       name="refId"
                                       onChange={this.cleanupErrors}
                                       readOnly={!!this.state.refId}
                                       defaultValue={this.state.refId}
                                />
                            </div>
                        </fieldset>
                    </div>

                    <div className="form-group mt-5">
                        <div className="custom-checkbox ml-1 d-flex justify-content-center">
                            <Toggle label="" defaultToggled={false} required/>

                            <span>
                                I agree to <a href="https://coinmetro.com/terms-of-use/" className="primary" target="_blank">
                                Website Terms of Use</a> and the <a href="https://coinmetro.com/wp-content/uploads/terms-conditions.pdf" className="primary" target="_blank">
                                General Terms and Conditions</a> as well as the <a href="https://coinmetro.com/privacy-policy/" className="primary" target="_blank">
                                Privacy Policy</a>
                            </span>
                        </div>
                    </div>

                    <div className="card-action no-border text-center p-0 mt-4">
                        <button className="btn btn-round btn-full btn-signup" disabled={this.props.loading}>
                            Yes! Create my free XCM account
                        </button>

                        <a href="#/account/login" className="btn btn-round btn-full btn-signin mt-4"
                           onClick={this.cleanupErrors} disabled={this.props.loading}>
                            Login to your XCM account
                        </a>
                    </div>
                </form>
            </div>
        );
    }
}

SignUp.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        userData: state.userReducer.userData,
        loading: state.userReducer.signupLoading,
        error: state.userReducer.signupError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (req) => dispatch(AccountActions.signUp(req.data)),
        signUpError: (data) => dispatch(AccountActions.signUpError(data)),
        signUpErrorReset: () => dispatch(AccountActions.signUpErrorReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

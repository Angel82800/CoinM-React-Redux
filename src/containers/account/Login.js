import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import formSerialize from "form-serialize";

import APPCONFIG from "../../constants/Config";
import { AccountActions } from "../../redux/app/actions";
import LoadingOverlay from "../../components/Common/LoadingOverlay/index";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            brand: APPCONFIG.brand
        };
    }

    login = (e) => {
        e.preventDefault();
        this.props.login({
            data: formSerialize(e.target, { hash: true }),
        }).then(() => {
            this.context.router.push("/overview");
        });
        this.props.loginErrorReset();
    };

    cleanupErrors = () => {
        this.props.loginErrorReset();
    };

    render() {
        return (
            <div className="card bg-white">
                <LoadingOverlay overlayClass={(this.props.loading) ? "overlay show" : "overlay"} message=""/>

                <form className="form-horizontal" method="POST" onSubmit={(e) => this.login(e)}>
                    <div className="card-content ph-60">
                        <div className="onboarding-text">
                            <section className="logo text-center">
                                <h4 className="mb-4 auth-title">Use the form below to get on board</h4>
                            </section>

                            <hr/>
                        </div>

                        <fieldset className="mb-3">
                            <div className="form-group">
                                <span className="text-danger">{this.props.error}</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="login">Login</label>
                                <input type="text" className="secondary" id="login" name="login"
                                       onClick={this.cleanupErrors} placeholder="Enter your Email Address" required/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="secondary" id="password" name="password"
                                       onClick={this.cleanupErrors} placeholder="********" required/>
                            </div>
                        </fieldset>
                    </div>

                    <div className="card-action p-0 mt-4 no-border text-center">
                        <button className="btn btn-round btn-full btn-signin" disabled={this.props.loading}>
                            Login to your XCM account
                        </button>

                        <a href="#/account/signup" className="btn btn-round btn-full btn-signup mt-4"
                           onClick={this.cleanupErrors} disabled={this.props.loading}>
                            Sign Up for a free XCM account
                        </a>

                        <div className="redirect-link mt-4 text-center">
                            Can't log in? <a href="#/account/recover-password" onClick={this.cleanupErrors}>Recover Password</a>
                        </div>
                    </div>

                    <div className="card-action no-border text-center hidden-xs-up">
                        <h4>Login via SSO</h4>

                        <div className="social-icons">
                            <a href="" className="hover-secondary"><i className="fa fa-linkedin-square fa-2x"/></a>
                            <span className="space"/>
                            <a href="" className="hover-secondary"><i className="fa fa-facebook-square fa-2x"/></a>
                            <span className="space"/>
                            <a href="" className="hover-secondary"><i className="fa fa-twitter fa-2x"/></a>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

Login.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        loading: state.userReducer.loginLoading || state.userReducer.fetchUserLoading,
        error: state.userReducer.loginError || state.userReducer.fetchUserError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: req => dispatch(AccountActions.login(req.data)),
        loginErrorReset: () => dispatch(AccountActions.loginErrorReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

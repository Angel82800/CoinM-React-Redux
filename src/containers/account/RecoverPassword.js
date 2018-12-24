import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import formSerialize from "form-serialize";

import APPCONFIG from "../../constants/Config";
import { AccountActions } from "../../redux/app/actions";

class RecoverPassword extends Component {
    constructor() {
        super();
        this.state = {
            brand: APPCONFIG.brand,
            successMsg: ""
        };
    }

    sendResetLink = (e) => {
        e.preventDefault();

        this.props.sendResetLink({
            data: formSerialize(e.target, { hash: true }),
        }).then((successMsg) => {
            this.setState({
                successMsg
            });
        });

        this.props.sendResetLinkErrorReset();
    };

    render() {
        return (
            <div className="card bg-white">
                <div className="card-content">
                    <section className="logo text-center">
                        <h4 className="mb-4">
                            Let us know where we should<br/>
                            send the instructions
                        </h4>
                    </section>

                    <form className="form-horizontal ph-60" method="POST" onSubmit={(e) => this.sendResetLink(e)}>
                        <hr/>

                        <fieldset className="mb-3">
                            <div className="form-group mt-3">
                                <span className="text-success">{this.state.successMsg}</span>
                            </div>

                            <div className="form-group mt-3">
                                <span className="text-danger">{this.props.error}</span>
                            </div>

                            <div className="form-group d-flex mt-3">
                                <input type="email" name="email" className="px-0 gray-border text-medium"
                                       placeholder="Type email address here" autoFocus required/>
                            </div>

                            <div className="form-group mt-4 text-center">
                                <button type="submit" className="btn btn-round primary d-flex align-items-center m-auto">
                                    <img src="assets/images/book.png"/>
                                    <span className="space"/>
                                    <span>Send Instructions</span>
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="card-action no-border text-center p-0 mt-5">
                    <div>
                        <span className="redirect-link">
                            Don't have an account? <a href="#/account/signup" className="primary">Sign up</a>
                        </span>
                    </div>

                    <div className="mt-4">
                        <span className="redirect-link">
                            Already got account? <a href="#/account/login" className="secondary">Sign in</a>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

RecoverPassword.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        twoFactorCB: state.twoFactorReducer.twoFactorCB,
        loading: state.userReducer.sendResetLinkLoading,
        error: state.userReducer.sendResetLinkError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendResetLink: (req) => dispatch(AccountActions.sendResetLink(req.data)),
        sendResetLinkErrorReset: () => dispatch(AccountActions.sendResetLinkErrorReset()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecoverPassword);

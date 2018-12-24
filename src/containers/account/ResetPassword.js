import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import formSerialize from "form-serialize";

import APPCONFIG from "../../constants/Config";
import { AccountActions } from "../../redux/app/actions";

class ResetPassword extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            brand: APPCONFIG.brand
        };

        if (!props.params.userId || !props.params.token) {
            context.router.push("/account/login");
        }
    }

    resetPassword = (e) => {
        e.preventDefault();

        this.props.resetPassword({
            data: formSerialize(e.target, { hash: true })
        }).then(() => {
            this.context.router.push("/account/reset-password/succeed");
        });
    };

    render() {
        return (
            <div className="card bg-white">
                <div className="card-content">
                    <section className="logo text-center">
                        <h4 className="mb-4">
                            Please type below<br/>
                            your new password
                        </h4>
                    </section>

                    <form className="form-horizontal ph-60" method="POST" onSubmit={(e) => this.resetPassword(e)}>
                        <hr/>

                        <div className="form-group">
                            <span className="text-danger">{this.props.error}</span>
                        </div>

                        <fieldset className="mb-3">
                            <div className="form-group d-flex mt-3">
                                <input type="hidden" name="token" className="px-0 gray-border text-medium" value={this.props.params.token} required/>
                                <input type="password" name="password" className="px-0 gray-border text-medium" autoFocus required/>
                            </div>

                            <div className="form-group mt-4 text-center">
                                <button className="btn btn-round primary d-flex align-items-center m-auto" disabled={this.props.loading}>
                                    Save New Password
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

ResetPassword.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        resetToken: state.userReducer.resetToken,
        loading: state.userReducer.resetPasswordLoading,
        error: state.userReducer.resetPasswordError
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetPassword: (req) => dispatch(AccountActions.resetPassword(req.data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

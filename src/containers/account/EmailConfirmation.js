import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { AccountActions } from "../../redux/app/actions";

class EmailConfirmation extends Component {
    constructor(props) {
        super(props);

        const { token } = props.params;
        this.props.verifyEmail({
            data: token,
        });
    }

    showContent = () => {
        if (this.props.loading) {
            return null;
        } else {
            if (this.props.error) {
                return this.props.error;
            }

            return "Thanks, your email has been verified successfully.";
        }
    };

    render() {
        return (
            <div className="card bg-transparent">
                <div className="card-content no-border">
                    <section className="logo text-center">
                        <h2 className="no-margin">Thank You!</h2>
                        <span className="page-subtitle">CoinMetro GO! Platform</span>
                    </section>

                    <div className="p-5"/>

                    <h5 className="mt-0 p-3 text-center">
                        {this.showContent()}
                    </h5>
                </div>

                {(!this.props.loading) && (
                    <div className="card-action no-border text-center p-0">
                        <a href="#/account/login" className="btn btn-round btn-white btn-border px-3 py-2 m-0 text-small">
                            <i className="fa fa-chevron-left"/> Go to Login
                        </a>
                    </div>
                )}
            </div>
        );
    }
}

EmailConfirmation.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        loading: state.userReducer.verifyEmailLoading,
        error: state.userReducer.verifyEmailError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyEmail: (req) => dispatch(AccountActions.verifyEmail(req.data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailConfirmation);

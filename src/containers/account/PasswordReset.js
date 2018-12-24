import React, { Component } from "react";

export default class PasswordReset extends Component {
    render() {
        return (
            <div className="card bg-transparent">
                <div className="card-content no-border">
                    <section className="logo text-center">
                        <h2 className="no-margin">Congratulations!</h2>
                        <span className="page-subtitle">CoinMetro GO! Platform</span>
                    </section>

                    <div className="p-5"/>

                    <h5 className="mt-0 p-3 text-center">
                        Password has been successfully changed.
                    </h5>
                </div>

                <div className="card-action no-border text-center p-0">
                    <a href="#/account/login" className="btn btn-round btn-white btn-border px-3 py-2 m-0 text-small">
                        <i className="fa fa-chevron-left"/> Go to Login
                    </a>
                </div>
            </div>
        );
    }
}

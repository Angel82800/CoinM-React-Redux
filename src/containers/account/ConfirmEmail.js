import React, { Component } from "react";

export default class ConfirmEmail extends Component {
    render() {
        return (
            <div className="card bg-transparent">
                <div className="card-content no-border">
                    <section className="logo mt-5 text-center">
                        <h2 className="no-margin">Thank You!</h2>
                        <span className="page-subtitle">CoinMetro GO! Platform</span>
                    </section>

                    <div className="position-relative mailbox-animation text-center">
                        <img className="mailbox" src="assets/images/mailbox.png"/>
                        <img className="cloud" src="assets/images/cloud-small-l.png"/>
                        <img className="cloud" src="assets/images/cloud-m.png"/>
                    </div>
                </div>

                <h5 className="mt-0 color-dark-1 text-center">
                    We just have sent an email with instructions how to finish a registration.
                </h5>

                <h5 className="mb-5 color-primary text-center">
                    Please check your mailbox.
                </h5>

                <div className="card-action no-border text-center p-0">
                    <a href="#/account/login" className="btn btn-round btn-white btn-border px-3 py-2 m-0 text-small">
                        <i className="fa fa-chevron-left"/> Go to Signin
                    </a>
                </div>
            </div>
        );
    }
}

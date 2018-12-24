import React, { Component } from "react";

export default class Animation extends Component {
    render() {
        const { current } = this.props;

        const title = {
            "login": "Sign in",
            "signup": "Sign up",
            "tfa": "Two Factor Authentication",
            "recover-password": "Recover Password",
            "reset-password": "Good job!"
        };

        const subtitle = {
            "login": "CoinMetro GO! Platform",
            "signup": "CoinMetro GO! Platform",
            "tfa": "Sign in"
        };

        return (
            <div className="position-relative sign-animation">
                <div className="d-flex align-items-end">
                    <div className="position-relative sign-animation-left">
                        <img className="" src="assets/images/sign-anim-base-left.png"/>

                        <img className="plant-blade" src="assets/images/plant-blade.png"/>

                        <img className="light-opacity" src="assets/images/light.png"/>

                        <div className="coin-mask text-center">
                            <img className="coin" src="assets/images/coin.png"/>
                        </div>

                        <div className="birds-mask">
                            <img className="bird" src="assets/images/bird.png"/>
                            <img className="bird" src="assets/images/bird.png"/>
                            <img className="bird" src="assets/images/bird.png"/>
                            <img className="cloud" src="assets/images/cloud-small-r.png"/>
                            <img className="cloud" src="assets/images/cloud-small-l.png"/>
                        </div>
                    </div>

                    <div className="flex-1 sign-animation-line"/>

                    <div className="position-relative sign-animation-right">
                        <img className="" src="assets/images/sign-anim-base-right.png"/>

                        <div className="birds-mask">
                            <img className="bird" src="assets/images/bird.png"/>
                            <img className="bird" src="assets/images/bird.png"/>
                            <img className="bird" src="assets/images/bird.png"/>
                            <img className="cloud" src="assets/images/cloud-m.png"/>
                            <img className="cloud" src="assets/images/cloud-small-r.png"/>
                            {/*<img className="cloud" src="assets/images/cloud-big.png" />*/}
                        </div>
                    </div>
                </div>

                <div className="train-mask">
                    <div className="position-relative full-height">
                        <img className="train" src="assets/images/train.png"/>
                    </div>
                </div>

                <div className="page-title d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <h2 className={"mt-0 mb-2" + (current === "reset-password" ? " primary" : "")}>
                            {title[current]}
                        </h2>

                        {current === "recover-password"
                            ? (
                                <a href="#/account/login" className="btn btn-round btn-white btn-border px-3 py-2 text-small">
                                    <i className="fa fa-chevron-left"/> Go Back
                                </a>
                            )
                            : (
                                <span className="page-subtitle">{subtitle[current]}</span>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

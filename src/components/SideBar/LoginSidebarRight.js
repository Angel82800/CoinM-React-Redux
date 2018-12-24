import React from "react";

import APPCONFIG from "../../constants/Config";

const LoginSidebarRight = ({ current }) => {
    const getHelp = () => {
        let links = [
            {
                caption: "What is CoinMetro?",
                link: "https://help.coinmetro.com/general-faq/what-is-coinmetro"
            },
            {
                caption: "CoinMetro Pre-Token Sale",
                link: "https://help.coinmetro.com/coinmetro-token-sale/coinmetro-pre-token-sale"
            },
            {
                caption: "Frequently Asked Questions",
                link: "https://help.coinmetro.com/"
            },
        ];

        let result = [];
        for (let i = 0; i < links.length; i++) {
            result.push(
                <a className="color-purple-4" href={links[i].link} target="_blank" key={i}>
                    <li>{links[i].caption}</li>
                </a>
            );
        }

        return result;
    };

    return (
        <div className="login-sidebar full-height ph-30 d-md-flex flex-column justify-content-between">
            <div className="d-none d-lg-block">
                <div className="brand pv-40 text-center">
                    <a href="https://coinmetro.com" className="d-inline-block">
                        <img src="assets/logo-white.png" alt={APPCONFIG.brand}/>
                    </a>
                </div>

                {(current === "signup") && (
                    <div className="text-center text-md-left hidden-xs-up">
                        <h3 className="social-login-title m-0 text-white">Login via SSO</h3>

                        <div className="social-icons">
                            <a href="#" className="color-purple-4"><i className="fa fa-linkedin-square fa-2x"/></a>
                            <span className="space"/>
                            <a href="#" className="color-purple-4"><i className="fa fa-facebook-square fa-2x"/></a>
                            <span className="space"/>
                            <a href="#" className="color-purple-4"><i className="fa fa-twitter fa-2x"/></a>
                        </div>
                    </div>
                )}
            </div>

            <div className="d-none d-lg-block">
                <div className="position-relative d-lg-flex align-items-center">
                    <img className="shape-background" src="assets/images/shape1.png"/>

                    <div className="w-100 text-center"><img src="assets/images/frank.png" alt="Frank"/></div>

                    <div className="flex-3 text-center hidden-xs-up">
                        <h5 className="text-white">Have a Questions?</h5>

                        <a className="btn btn-round btn-white ask-frank d-flex align-items-center px-3 py-2 m-auto"
                           href="https://t.me/CoinMetro" target="_blank"
                        >
                            <img src="assets/images/message.png"/>
                            <span className="space"/>
                            <span className="text-small">Ask Frank</span>
                        </a>
                    </div>
                </div>

                <ul className="questions pv-40 pl-3">
                    {getHelp()}
                </ul>

                <div className="pv-40 text-small color-purple-4">
                    <i>&copy; 2018 CoinMetro Limited </i><br/>
                    <i>Hong Kong</i>
                </div>
            </div>

            <div className="d-flex d-lg-none align-items-center">
                <ul className="questions pv-40 pl-3">
                    {getHelp()}
                </ul>

                <div className="flex-1">
                    <div className="logo-wrapper ml-auto py-3 color-purple-4 text-center">
                        <a href="https://coinmetro.com" className="d-inline-block text-center">
                            <img src="assets/logo-icon-white.png" width="50" alt={APPCONFIG.brand}/>
                            <div className="logo-title">CoinMetro</div>
                            <div className="logo-subtitle">INNOVATION POWERED BY CRYPTO</div>
                        </a>

                        <div className="mt-2 logo-limited"><i>&copy; 2018 CoinMetro Limited</i></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSidebarRight;

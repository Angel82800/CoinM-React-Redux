import React, { Component } from "react";

import LoginSidebarRight from "../../components/SideBar/LoginSidebarRight";
import Animation from "./Animation";

export default class Account extends Component {
    render() {
        const { children, location } = this.props;

        let links = location.pathname.split("/");
        let currentPage = links[links.length - 1];

        const includeAnimation = [
            "login",
            "signup",
            "tfa",
            "recover-password",
            "reset"
        ];

        if (links.indexOf("email-confirmation") > -1 || links.indexOf("reset-password") > -1) {
            currentPage = "confirm";
        } else if (links.indexOf("reset") > -1) {
            currentPage = "reset";
        }

        return (
            <div className="main-app-container">
                <section id="page-container" className="app-page-container">
                    <div className="app-content-wrapper">
                        <div className="full-height d-lg-flex">
                            <div className="flex-3 auth-top">
                                {(includeAnimation.indexOf(currentPage) > -1) && (
                                    <Animation current={currentPage}/>
                                )}

                                <div className={"page-auth page-" + currentPage}>
                                    <div className="main-body">
                                        {children}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <LoginSidebarRight current={currentPage}/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

import React from "react";
import { Cookies } from "react-cookie";
import { IndexRoute, Route, IndexRedirect, Redirect } from "react-router";

import App from "./app/App";

import Account from "./account/Account";
import Login from "./account/Login";
import SignUp from "./account/SignUp";
import ConfirmEmail from "./account/ConfirmEmail";
import EmailConfirmation from "./account/EmailConfirmation";
import RecoverPassword from "./account/RecoverPassword";
import ResetPassword from "./account/ResetPassword";
import PasswordReset from "./account/PasswordReset";

import Error404 from "./error/Error404";

import TradeApp from "./TradeApp";
import ExchangeApp from "./ExchangeApp";
import MainApp from "./MainApp";

import References from "./references";
import Dashboard from "./dashboard";
import Overview from "./overview";
import ExchangeView from "./exchange/ExchangeView";
import TradeView from "./trade/TradeView";
import ETCF from "./etcf";
import Tam from "./tam";
import Academy from "./academy";
import Kyc from "./kyc";

import { pushToGTM } from "../constants/Helpers";

function asyncComponent(component) {
    return (_r, cb) => cb(null, component);
}

export default function createRoutes(getState) {
    const requireAuth = (nextState, replace) => {
        const state = getState();
        const loggedInUser = state.userReducer.userData;
        let token = localStorage.getItem("jwtToken");
        if (!token || !loggedInUser) {
            replace({
                pathname: "/account/login",
                state: {
                    nextPathname: nextState.location.pathname
                }
            });
        }
    };

    const redirectAuth = (nextState, replace) => {
        const state = getState();
        const loggedInUser = state.userReducer.userData;
        let token = localStorage.getItem("jwtToken");

        if (token && loggedInUser) {
            replace({
                pathname: "/overview",
                state: {
                    nextPathname: nextState.location.pathname
                }
            });
        }
    };

    /**
     * Get URL parameter
     */
    const getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    /**
     * Handle referral url
     */
    const checkReferral = (nextState) => {
        const cookies = new Cookies;
        const referralId = getParameterByName("refId");

        if (referralId) {
            // add referral cookie

            const expireDate = new Date();
            // set cookie expiration date to one year later
            expireDate.setTime(expireDate.getTime() + 31536000000);

            cookies.set("refId", referralId, {
                path: "/",
                expires: expireDate,
            });

            window.location.href = "https://coinmetro.com";
        }
    };

    /**
     * Handle track_id url
     */
    const checkMktTracking = (nextState) => {
        const cookies = new Cookies;
        const mktParams = ["utm_source", "utm_campaign", "utm_medium", "utm_term", "utm_content", "oid", "pid", "s1", "s2"];

        mktParams.forEach(mktParam => {
            const paramValue = getParameterByName(mktParam);

            if (paramValue) {
                // add marketing cookie

                const expireDate = new Date();
                // set cookie expiration date to one year later
                expireDate.setTime(expireDate.getTime() + 31536000000);

                cookies.set(mktParam, paramValue, {
                    path: "/",
                    expires: expireDate,
                });
            }
        });
    };

    /**
     * Handle params in url
     */
    const onEntry = (nextState) => {
        checkReferral(nextState);
        checkMktTracking(nextState);
        if (typeof dataLayer !== "undefined" && !dataLayer.find(e => (e.event === "cm-pageview")))
            pushToGTM({ "event": "cm-pageview" }, "pageviewEvent");
    };

    const onPageChange = (prevState, nextState) => {
        // if (prevState.location.action == "PUSH" &&
        //    nextState.location.action == "POP")
        //     pushToGTM({ 'event': 'cm-pageview' }, 'pageviewEvent');
    };

    return (
        <Route getComponent={asyncComponent(App)} path="/" onEnter={onEntry} onChange={onPageChange}>
            <IndexRedirect to="/account/login"/>

            <Route getComponent={asyncComponent(Account)} path="/account" onEnter={redirectAuth}>
                <IndexRedirect to="/account/login"/>

                <Route getComponent={asyncComponent(Login)} path="login"/>
                <Route getComponent={asyncComponent(SignUp)} path="signup"/>
                <Route getComponent={asyncComponent(ConfirmEmail)} path="confirm"/>
                <Route getComponent={asyncComponent(EmailConfirmation)} path="email-confirmation/:token"/>
                <Route getComponent={asyncComponent(RecoverPassword)} path="recover-password"/>
                <Route getComponent={asyncComponent(ResetPassword)} path="reset/:userId/:token"/>
                <Route getComponent={asyncComponent(PasswordReset)} path="reset-password/succeed"/>
            </Route>

            <Route getComponent={asyncComponent(MainApp)} path="/" onEnter={requireAuth}>
                <IndexRedirect to="/overview"/>

                <Route getComponent={asyncComponent(Overview)} path="/overview"/>
                {/*<Route getComponent={asyncComponent(Exchange)} path="/exchange"/> */}
                {/*<Route getComponent={asyncComponent(Trade)} path="/trade"/> */}
                <Route getComponent={asyncComponent(Dashboard)} path="/dashboard"/>
                <Route getComponent={asyncComponent(Dashboard)} path="/ambassador"/>
                <Route getComponent={asyncComponent(References)} path="/settings/:type"/>
                <Route getComponent={asyncComponent(ETCF)} path="/etcf"/>
                <Route getComponent={asyncComponent(Tam)} path="/tam"/>
                <Route getComponent={asyncComponent(Academy)} path="/laboratory/do"/>

                <Route getComponent={asyncComponent(Kyc)} path="/kyc">
                    <IndexRedirect to="/kyc/status"/>
                    <Route path="/kyc/:type"/>
                    <Route path="/kyc/:type/:secType"/>
                </Route>
            </Route>

            <Route getComponent={asyncComponent(TradeApp)} path="/trade" onEnter={requireAuth}>
                <IndexRedirect to="/trade/view"/>

                <Route getComponent={asyncComponent(TradeView)} path="view"/>
            </Route>

            <Route getComponent={asyncComponent(ExchangeApp)} path="/exchange" onEnter={requireAuth}>
                <IndexRedirect to="/exchange/view"/>

                <Route getComponent={asyncComponent(ExchangeView)} path="view"/>
            </Route>

            {/*<Route getComponent={asyncComponent(MainApp)} path="/kyc" onEnter={requireAuth}>*/}
                {/*<IndexRedirect to="/kyc/status"/>*/}
            {/*</Route>*/}

            <Route getComponent={asyncComponent(Error404)} path="*"/>
        </Route>
    );
}

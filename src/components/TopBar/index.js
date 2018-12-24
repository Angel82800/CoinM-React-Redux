import React, { Component } from "react";

export default class TopBar extends Component {
    changeSelect = (newSelect) => {
        this.setState({
            selected: newSelect
        });
    };

    render() {
        const tabs = [
            { link: "#/dashboard", name: "wallet", icon: "wallet" },
            { link: "#/exchange", name: "exchange", icon: "exchange" },
            { link: "#/trade", name: "trade", icon: "trade" },
            { link: "#/etcf", name: "ETCF", icon: "settings" },
            { link: "#/tam", name: "TAM", icon: "stats" }
        ];

        return (
            <div className="row go-header-navigation-container pt-3">
                <div className="col-9 go-header-navigation">
                    {tabs.slice(0, 1).map((tab, index) => (
                        <a key={index} href={tab.link}
                           className={"go-header-navigation-item" + (tab.link && this.props.location.pathname.includes(tab.link.slice(1)) ? " active" : "")}>
                            <div><img className="enabled" src={"assets/img/go-" + tab.icon + ".svg"} alt={tab.name.toUpperCase()}/></div>
                            <div><div className="go-header-navigation-description">{tab.name}</div></div>
                        </a>
                    ))}

                    {tabs.slice(1).map((tab, index) => (
                        <a key={index + 1}
                           className={"go-header-navigation-item" + (tab.link && this.props.location.pathname.includes(tab.link.slice(1)) ? /*" active"*/ "" : "")}>
                            <div><div className="go-header-navigation-coming-soon">COMING SOON</div></div>
                            <div><img src={"assets/img/go-" + tab.icon + ".svg"} alt={tab.name.toUpperCase()}/></div>
                            <div><div className="go-header-navigation-description">{tab.name}</div></div>
                        </a>
                    ))}
                </div>

                <div className="col-3 go-support-section" onClick={() => window.Intercom("show")}>
                    <a className="go-button-white"> {/*href="https://t.me/CoinMetro" target="_blank" */}
                        <img src="assets/img/support-icon.png" className="go-button-support-icon"/><span>Support</span>
                    </a>
                </div>
            </div>
        );
    }
}

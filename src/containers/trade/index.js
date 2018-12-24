import React, { Component } from "react";

import TradePair from "./TradePair";

class Trade extends Component {
    constructor(props) {
        super(props);

        this.state = {
            charts: [
                { id: 1, data: "" },
                { id: 2, data: "" },
                { id: 3, data: "" },
                { id: 4, data: "" },
            ]
        };
    }

    render() {
        const windowHeight = window.innerHeight;
        const pairCount = this.state.charts.length;
        const pairHeight = pairCount * 400 > windowHeight ? 400 : windowHeight / pairCount;

        return (
            <div className="h100 trade-app-container">
                <div className="go-content-row">
                    {this.state.charts.map((item, i) => (
                        <TradePair item={item} key={i} height={pairHeight}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default Trade;

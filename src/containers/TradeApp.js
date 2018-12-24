import React, {Component} from "react";

export default class TradeApp extends Component {
    render() {
        const {children, location} = this.props;

        return (
            <div className="trade-app-container">
                {children}
            </div>
        )
    }
}

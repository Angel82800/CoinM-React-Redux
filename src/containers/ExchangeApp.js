import React, {Component} from "react";

export default class TradeApp extends Component {
    render() {
        const {children, location} = this.props;

        return (
            <div className="exchange-app-container">
                {children}
            </div>
        )
    }
}

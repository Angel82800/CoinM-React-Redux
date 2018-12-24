import React from "react";

const TradeNavigation = ({ state, changeStatus }) => (
    <div className="trade-navigation">
        <ul className="d-flex justify-content-center">
            <li className={state.trades ? "active" : ""}>
                <a href="#">Trades</a>
                <div className="bg" onClick={() => changeStatus("trades")}>
                    <div className="point"/>
                </div>
            </li>

            <li className={state.book ? "active" : ""}>
                <a href="#">Book</a>
                <div className="bg" onClick={() => changeStatus("book")}>
                    <div className="point"/>
                </div>
            </li>

            <li className={state.depth ? "active" : ""}>
                <a href="#">Depth</a>
                <div className="bg" onClick={() => changeStatus("depth")}>
                    <div className="point"/>
                </div>
            </li>
        </ul>
    </div>
);

export default TradeNavigation;

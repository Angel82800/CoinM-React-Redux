import React, { Component } from "react";

import { Months } from "../../constants/Helpers";
import { getCrypto } from "../../constants/Cryptos";

export default class ExchangeCalendar extends Component {
    componentDidMount() {
        // $(".ex-calendar-number").owlCarousel({
        //     loop: true,
        //     autoplay: false,
        //     autoplayHoverPause: true,
        //     margin: 0,
        //     nav: false,
        //     dots: false,
        //     autoWidth: false,
        //     smartSpeed: 500,
        //     center: true,
        //     items: 1
        // });
        //
        // $(".ex-calendar-number").trigger("next.owl.carousel");
        //
        // $(".ex-calendar-number").on("translate.owl.carousel", function (event) {
        //     $(".ex-calendar-container").addClass("hide");
        // });
        //
        // $(".ex-calendar-number").on("translated.owl.carousel", function (event) {
        //     $(".ex-calendar-container").removeClass("hide");
        // });
        //
        // $(".fa-caret-left").on("click", function () {
        //     $(".ex-calendar-number").trigger("prev.owl.carousel");
        // });
        //
        // $(".fa-caret-right").on("click", function () {
        //     $(".ex-calendar-number").trigger("next.owl.carousel");
        // });
    }

    render() {
        const { crypto } = this.props;

        const curDate = new Date();
        const first = curDate.getDate();
        const first_pos = curDate.getDay();
        const month = new Date(curDate.setDate(first + 6)).getMonth();
        const year = new Date(curDate.setDate(first + 6)).getFullYear();

        const week = [];
        for (let i = 6; i >= 0; i--) {
            const day = new Date(curDate.setDate(first - i)).getDate();
            week.push(
                <span key={i}>{day}</span>
            );
        }

        const weekNames = [];
        const names = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        for (let i = 6; i >= 0; i--) {
            const pos = (first_pos - i) > -1 ? first_pos - i : first_pos - i + 7;
            weekNames.push(
                <span key={i}>{names[pos]}</span>
            );
        }

        let week_avg = (this.props.crypto.sevenDays || []).reduce((sum, v) => sum + v, 0)/7;

        return (
            <div className={"ex-crypto-week " + this.props.className}>
                <div className="ex-calendar-container">
                    <div className="ex-calendar">
                        <div className="ex-calendar-month">
                            {/*<i className="fas fa-caret-left"/>*/}
                            <div><img className="ex-actions-icon" src={"assets/images/" + crypto.iconm} alt=""/><span>Last 7 Days</span></div>
                            {/*<i className="fas fa-caret-right"/>*/}
                        </div>

                        <div className="ex-calendar-days">
                            {weekNames}
                        </div>

                        <div className="ex-calendar-number owl-carousel">
                            <div className="w3">
                                {week}
                            </div>
                        </div>
                    </div>

                    <div className="ex-calendar-perc">
                        {(this.props.crypto.sevenDays || []).map(pct =>
                        <div className={pct < 0 ? "down" : ""}>
                            <p>{pct > 0 ? '+' : ''}{pct.toFixed(1)}%</p>
                            <div className="ex-calendar-status"/>
                        </div>)}
                    </div>

                    <div className="ex-weekly-avg">
                        <div>
                            {
                                ( week_avg > 0 ) ?
                                    <img src="assets/img/stats-icon.svg" alt=""/>
                                    :
                                    <img src="assets/img/stats-icon-red.svg" alt=""/>
                            }
                            <span>Weekly Average</span></div>
                        <div><span className="ex-weekly-perc">{(v => `${v > 0 ? '+' : ''}${v.toFixed(2)}`)(week_avg)}%</span></div>
                    </div>
                </div>
            </div>
        );
    }
}

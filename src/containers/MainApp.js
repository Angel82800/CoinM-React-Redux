import React, { Component } from "react";

import SideBar from "../components/SideBar";
import GoOpt from "../components/Popup/GoOpt";
import TopBar from "../components/TopBar";

export default class MainApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
            selected: "overview"
        };
    }

    changeCollapseState = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    componentDidMount() {
        window.Intercom("boot", {
            app_id: "wrka7ryo",
            //     email: 'example@example.com',
            //     user_id: 'abc123',
            //    created_at: 1234567890,
            hide_default_launcher: true
        });
    }

    render() {
        return (
            <div className="main-app-container">
                <SideBar
                    location={this.props.location}
                    collapsed={this.state.collapsed}
                    changeCollapseState={this.changeCollapseState}
                    selected={this.state.selected}
                    changeSelect={this.changeSelect}
                />

                <div className={"go-container" + (this.state.collapsed ? " full" : "")}>
                    <div className="go-row">
                        <div className="go-content">
                            <div className="container-fluid go-content-container">
                                <TopBar location={this.props.location}/>

                                {this.props.children}
                            </div>

                            <GoOpt/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

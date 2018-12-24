import React, { Component } from "react";

export default class Error500 extends Component {
    render() {
        return (
            <div className="page-err">
                <div>
                    <div className="err-container text-center">
                        <div className="err">
                            <h1>500</h1>
                            <h2>Sorry, server goes wrong</h2>
                        </div>

                        <div className="err-body">
                            <a href="#/" className="btn btn-raised btn-lg btn-default">
                                Go Back to Home Page
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

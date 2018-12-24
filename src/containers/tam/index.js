import React, { Component } from "react";

class Tam extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="services-tam">
                    <h1>TAM</h1>

                    <p className="f-b20w">If you’re looking to team up with a professional trader, look no further.</p>

                    <p className="f-m20">
                        Tokenized Asset Management (TAM) is basically a super easy way to partner up with a pro trader: invest however much you want in a TAM account, and a pro trader takes over the
                        investing part for you. You earn profits, they earn a commission, everybody wins.
                    </p>
                    <ul>
                        <li>You choose the manager you want to work</li>
                        <li>You choose how much you want to invest</li>
                        <li>Your manager takes over the trading part in exchange for a reasonable commission based on their performance</li>
                        <li>You reap the rewards</li>
                        <li>Of course, you can stop any time, but we’re pretty sure you’re not going to want to.</li>
                    </ul>

                    <p>
                        Based on a highly successful managed account model we designed and implemented at FXPIG (our strategic partner), TAM is designed to give anybody the opportunity to work with a
                        pro trader to grow their account. The TAM account model is extremely flexible: you can start with TAM and move to a self-managed account, or maybe even become an account manger
                        yourself. ICO
                    </p>
                </div>

                <div className="services-tam-add">
                    <div className="tractor">
                        <p className="f-b16b">CoinMetro’s quality control team</p>
                        <p className="f-m14g">individually vets each ICO proposal.</p>
                    </div>

                    <div className="tap">
                        <p className="f-b16b">Approved projects</p>
                        <p className="f-m14g">can access the tools and support they need to secure initial funding.</p>
                    </div>

                    <div className="sheme">
                        <p className="f-b16b">On the backend,</p>
                        <p className="f-m14g">our infrastructure handles blockchain integration and token issuance.</p>
                    </div>

                    <div className="set">
                        <p className="f-b16b">After a successful ICO</p>
                        <p className="f-m14g">your token is immediately liquid and tradable on the CoinMetro Exchange.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Tam;

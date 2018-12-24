import React from "react";

const Pending = () => (
    <div className="row">
        <div className="col-md-12 align-self-center justify-content-center text-center">
            <div className="ga-pending-container">
                <img src="assets/images/logo.png"/>
            </div>

            <h3>Verification Pending</h3>
            <span>Your submission has been received. Check back here later for verification status.</span>
            <div className = "hidden-sm-down d-inline-flex justify-content-center" >
                <a href={"#/kyc/intro/FACE"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                    Resubmit selfie
                </a>
                <a href={"#/kyc/intro/ID"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                    Resubmit ID
                </a>
                <a href={"#/kyc/intro/POA"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                    Resubmit POA
                </a>
            </div>

            <div className="hidden-md-up">
                <a href={"#/kyc/intro/FACE"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                    Resubmit selfie
                </a>
                <a href={"#/kyc/intro/ID"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                    Resubmit ID
                </a>
                <a href={"#/kyc/intro/POA"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                    Resubmit POA
                </a>
            </div>

            <a href={"#/kyc/parsing"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                Review your data
            </a>

            <a href={"#/references/profile"} className="btn btn-round ga-but-camera ga-mt25 d-block ga-w300p mx-auto">
                Go back to your profile
            </a>
        </div>
    </div>
);

export default Pending;

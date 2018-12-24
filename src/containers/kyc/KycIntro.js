import React from 'react';

import KycAcceptedDocs from './KycAcceptedDocs';
import TrainMountainAnim from '../../components/Animations/TrainMountainAnim';

const KycIntro = ({type}) => {
    return (
        <div className="col-md-12 ga-kyc-intro-content ga-kyc-blue align-self-center ga-anim-show-bottom-opacity">
            <div className="row">
                <div className="col-md-12">
                    <h2>{type == "FACE" ?
                    "Anti Money Laundering Policy requires a KYC procedure for clients." :
                    (type == "ID" ? "Now we need a valid Identity Document" :
                    "You're almost done! We just need a valid Proof of Address")}</h2>
                </div>
            </div>

            <div className="row ga-mt50">
                <div className="col-lg-5 text-lg-left text-center">
                    <KycAcceptedDocs type={type}/>
                </div>

                <div className="col-lg-7 text-center ga-left-border">
                    <img src="assets/images/camera.png" className="d-block mx-auto"/>
                    <a href={`#kyc/snapshot/${type}`} className="btn btn-round ga-but-camera ga-mt25">
                        <img src="assets/images/camera-violet.png"/>
                        <img src="assets/images/camera-white.png"/>
                        Take a snapshot using camera
                    </a>

                    {type !== "FACE" && (
                        <div>
                            <span className="d-block mx-auto my-3">or</span>,
                            <a href={`#kyc/upload/${type}`} className="btn btn-round ga-but-scan">
                                <img src="assets/images/arrow-top-violet.png" />
                                <img src="assets/images/arrow-top.png" />
                                Upload scanned document
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <TrainMountainAnim/>
        </div>
    );
};

export default KycIntro;

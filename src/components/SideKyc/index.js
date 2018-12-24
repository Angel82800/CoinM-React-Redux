import React from "react";

import SideKycContent from "./SideKycContent";

const SideKyc = ({ location, type }) => (
    <div className="kyc-sidebar">
        <section className="sidebar-content">
            <SideKycContent location={location} type={type}/>
        </section>
    </div>
);

export default SideKyc;

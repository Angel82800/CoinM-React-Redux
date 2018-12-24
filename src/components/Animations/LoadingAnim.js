import React from "react";

const LoadingAnim = ({ className, message }) => (
    <div className={`ga-loading-animation text-center ` + className}>
        {(className === "ga-loader-white")
            ? (<img className="ga-loader" src="assets/images/loader.png"/>)
            : (<img className="ga-loader" src="assets/images/loader-blue.png"/>)
        }
        <span>{message}</span>
    </div>
);

export default LoadingAnim;

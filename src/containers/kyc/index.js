import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { KycActions } from '../../redux/app/actions';
import KycIntro from './KycIntro';
import KycSnapshot from './KycSnapshot';
import KycUpload from './KycUpload';
import KycParsing from './KycParsing';
import KycStatus from './KycStatus';
import KycPoa from './KycPoa';
import KycPreview from './KycPreview';
import SideKyc from '../../components/SideKyc';

class Kyc extends Component {
  getComponentByType = (type, secType) => {
    switch (type) {
      case "intro":
        return <KycIntro type={secType} />;
      case "snapshot":
        return <KycSnapshot type={secType} />;
      case "upload":
        return <KycUpload type={secType} />;
      case "parsing":
        return <KycParsing />;
      case "poa":
        return <KycPoa />;
      case "preview":
        return <KycPreview />;
      case "status":
      default:
        return <KycStatus status={this.props.status} comment={this.props.comment} type={secType} />;
    }
  };

  componentDidMount() {
    this.props.verifyChecking({
      token: this.props.userToken,
      cb: (result) => {
        /*
        if (this.props.status !== "none") {
            const loadthumbnail = (type) => {
                let div = document.querySelector(`div#kycSnaps${type}`);
                if (!div) {
                    div = document.querySelector('div#kycSnaps').appendChild(document.createElement("div"));
                    div.id = `kycSnaps${type}`;
                    div.onclick = () => this.context.router.push(`/kyc010318/intro/${type}`);
                    div.className = "ga-kyc-snap-sub";
                } else {
                    div.innerHTML = "";
                }

                const ext = this.props[`${type}url`].split("?")[0].split(".").pop();
                if (ext === "pdf")
                    ReactDOM.render(
                        <Document file={this.props[`${type}url`]}>
                            <Page pageNumber={1} width={div.offsetWidth * 0.8}/>
                        </Document>,
                        div);
                else {
                    const img = document.createElement('img');
                    img.src = this.props[`${type}url`];
                    div.appendChild(img);
                }
            };
            loadthumbnail("FACE");
            loadthumbnail("ID");
            loadthumbnail("POA");
        }
        */

        switch (this.props.status) {
          case "none":
            return this.context.router.push("/kyc/intro/FACE");
          case "pending":
          case "success":
          case "failure":
            return this.context.router.push("/kyc/status");
        }
      }
    });
  }

  render() {
    return (
      <div className={"ga-kyc-container"}>

        <div className="row full-height">
          <SideKyc location={this.props.location} type={this.props.params.secType} />
          <div className="col">
            {this.getComponentByType(this.props.params.type, this.props.params.secType)}
            <div style={{ position: "absolute", top: "10px", right: "25px" }}>
              <i style={{ cursor: "pointer" }} onClick={() => window.open("https://coinmetro.com/kyc/QA-EN")} className="fa fa-question-circle fa-3x" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Kyc.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    userToken: state.userReducer.userToken,
    status: state.kycReducer.status,
    comment: state.kycReducer.comment,
    FACEurl: state.kycReducer.FACEurl,
    IDurl: state.kycReducer.IDurl,
    POAurl: state.kycReducer.POAurl
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyChecking: (req) => dispatch(KycActions.verifyChecking(req.token, req.cb))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Kyc);

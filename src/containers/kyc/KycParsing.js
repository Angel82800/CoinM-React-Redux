import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import formSerialize from 'form-serialize';

const accents = require('remove-accents');

import {KycActions} from '../../redux/app/actions';
import KycParsingPersonalInformation from './KycParsingPersonalInformation';
import KycParsingAddress from './KycParsingAddress';
import TrainMountainAnim from '../../components/Animations/TrainMountainAnim';

class KycParsing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addressFree: !!this.props.existingDataPOA.fullAddress,
        };
    }

    closeNotification = () => {
        this.setState({activeNotify: false});
    };

    componentDidMount() {
        // this.form = document.getElementById('kycForm');
        // this.inputs = this.form.getElementsByTagName('input');
        // let tel = document.querySelector('input[type=tel]');
        // tel.setAttribute("id", "kycPhone");
        // tel.setAttribute("required", '');

        const formatCountry = state => {
            if (!state.id || state.text.indexOf("Searching") > -1) {
                return state.text;
            }

            return $("<img width='30' height='auto' src='../../assets/images/flags_small/"
                + accents.remove(state.text).replace(/ /g, "_").toLowerCase() + ".gif'/>"
                + "<span class='pl-2'>" + state.text + "</span>");
        };

        $('.countrypicker').select2({
            templateResult: formatCountry,
            templateSelection: formatCountry
        });
    };

    handleOnChange = (value) => {
        this.setState({
            phone: value
        });
        // this.checkForm(() => {});
    };

    formSubmit = (e) => {
        e.preventDefault();

        const data = formSerialize(e.target, {hash: true});
        if (this.state.addressFree) {
            data.kycStreet = null;
            data.kycStreet2 = null;
            data.kycLocality = null;
            data.kycRegion = null;
            data.kycPostal = null;
        } else {
            data.kycFullAddress = null;
        }

        this.props.sendFormData({
            token: this.props.userToken,
            data,
            cb: () => {
                this.context.router.push("/kyc/status");
            }
        });
    };

    render() {
        return (
            <div className="col-md-12 ga-kyc-parsing-content ga-kyc-transparent ga-anim-show-bottom-opacity">
                <div className="row">
                    <div className="col-md-12 text-lg-left text-md-left text-center">
                        <form id="kycForm" name="kycForm" onSubmit={this.formSubmit} method="POST">
                            <div className="row ga-auth ga-form">
                                {/*<div className="ga-kyc-form-notification">*/}
                                    {/*<div className={`ga-kyc-notification ${(this.state.activeNotify) ? 'active' : ''}`} id="kycFormNotification">*/}
                                        {/*Please fill highlighted fields!<i className="fa fa-times" aria-hidden="true" onClick={this.closeNotification}/>*/}
                                    {/*</div>*/}

                                    {/*<div className='ga-kyc-notification active'>*/}
                                        {/*We filled some fields automatically for you based on the extracted data, please fill in the rest!*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                <KycParsingPersonalInformation existingDataID={this.props.existingDataID}/>

                                <KycParsingAddress
                                    addressFree={this.state.addressFree}
                                    changeAddressFree={() => this.setState({addressFree: !this.state.addressFree})}
                                    existingDataPOA={this.props.existingDataPOA}
                                />

                                <div className="col-md-12">
                                    <button className="ga-submit ga-150p ma-auto d-block ga-mt40" type="submit">Confirm</button>
                                </div>

                                <TrainMountainAnim />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

KycParsing.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        userToken: state.userReducer.userToken,
        existingDataID: state.kycReducer.existingDataID || {},
        existingDataPOA: state.kycReducer.existingDataPOA || {}
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendFormData: (req) => dispatch(KycActions.sendFormData(req.data, req.token, req.cb))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(KycParsing);

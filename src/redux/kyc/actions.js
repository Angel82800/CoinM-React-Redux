import axios from "axios";
import qs from "qs";

import * as actionTypes from "../../constants/ActionTypes";

axios.defaults.baseURL = process.env.REACT_APP_API_URI;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const setBearerToken = (token) => {
    // add Bearer token to common axios request header
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

const titlesByPath = [
    {
        path: "/kyc/intro",
        name: "KYC Check"
    },
    {
        path: "/kyc/snapshot",
        name: "Document Snapshot"
    },
    {
        path: "/kyc/upload",
        name: "Document Upload"
    },
    {
        path: "/kyc/parsing",
        name: "Parsing Results"
    },
    {
        path: "/kyc/poa",
        name: "Proof of Address"
    },
    {
        path: "/kyc/preview",
        name: "Proof of Address"
    },
    {
        path: "/kyc/status",
        name: "Verification Pending"
    },
    {
        path: "/kyc/error",
        name: "Parsing Results"
    }
];

let KycActions = {
    uploadDocument: function (files, type, docType, token, cb) {
        let _obj = this;
        return (dispatch) => {
            dispatch(_obj.uploadDocumentStart());

            setBearerToken(token);

            let data = new FormData();
            data.append("type", type);
            data.append("docType", docType);
            data.append("0", files[0], files[0].name);

            // files.forEach((file, index) => {
            //     data.append(index.toString(), file, file.name);
            // });

            axios.post("kyc/document", data)
                .then((response) => {
                    dispatch(_obj.uploadDocumentSuccess(response.data.data, type));
                    if (cb) cb();
                })
                .catch((error) => {
                    dispatch(_obj.uploadDocumentClearError());

                    if (error.response) {
                        dispatch(_obj.uploadDocumentError(error.response.data.response.errors.message));
                    } else {
                        dispatch(_obj.uploadDocumentError(error.message));
                    }
                });
        };
    },

    uploadDocumentStart: function () {
        return {
            type: actionTypes.UPLOAD_DOCUMENT
        }
    },

    uploadDocumentSuccess: function (data, docType) {
        return {
            type: actionTypes.UPLOAD_DOCUMENT_SUCCESS,
            data,
            docType
        }
    },

    uploadDocumentError: function (errorMsg) {
        return {
            type: actionTypes.UPLOAD_DOCUMENT_ERROR,
            errorMsg
        }
    },

    uploadDocumentClearError: function () {
        return {
            type: actionTypes.UPLOAD_DOCUMENT_CLEAR_ERROR
        }
    },

    sendFormData: function (data, token, cb) {
        let _obj = this;
        return (dispatch) => {
            dispatch(_obj.sendFormDataStart());

            setBearerToken(token);

            axios.post("kyc/sendData", qs.stringify(data))
                .then((response) => {
                    dispatch(_obj.sendFormDataSuccess());
                    if (cb) cb();
                })
            // .catch((error) => {
            //     console.log(JSON.stringify(error));
            //     if (error.response) {
            //         dispatch(_obj.sendFormDataError(error.response.data.response.errors.message));
            //     } else {
            //         dispatch(_obj.sendFormDataError(error.message));
            //     }
            // });
        };
    },

    sendFormDataStart: function () {
        return {
            type: actionTypes.SEND_KYC_DATA
        }
    },

    sendFormDataSuccess: function () {
        return {
            type: actionTypes.SEND_KYC_DATA_SUCCESS
        }
    },

    sendFormDataError: function (errorMsg) {
        return {
            type: actionTypes.SEND_KYC_DATA_ERROR
        }
    },

    getNextKYC: function (token) {
        let _obj = this;
        return (dispatch) => {
            setBearerToken(token);

            return axios.get("kyc/getKYC")
                .then((response) => {
                    // console.log(JSON.stringify(response, null, 1));
                    return response.data.data;
                })
                .catch((error) => {
                    if (error.response)
                        return Promise.reject(error.response.data.response.errors.message);
                    else
                        return Promise.reject(error.message);

                });
        };
    },

    setKYC: function (token, data) {
        let _obj = this;
        return (dispatch) => {
            setBearerToken(token);

            return axios.post("kyc/setKYC", qs.stringify(data))
                .catch((error) => {
                    if (error.response)
                        return Promise.reject(error.response.data.response.errors.message);
                    else
                        return Promise.reject(error.message);
                });
        };
    },

    changeNotification: function (notification) {
        return {
            type: actionTypes.CHANGE_KYC_NOTIFICATION,
            notification
        }
    },

    getTitle: function (path) {
        let name;
        titlesByPath.forEach((titles) => {
            if (titles.path === path) {
                name = titles.name
            }
        });

        return {
            type: actionTypes.GET_KYC_TITLE,
            name
        }
    },

    deleteDocument: function (file, token, cb) {
        let _obj = this;
        return (dispatch) => {
            dispatch(_obj.deleteDocumentStart());

            setBearerToken(token);

            axios.post("kyc/delete", file)
                .then((response) => {
                    if (cb) cb();
                    dispatch(_obj.deleteDocumentSuccess(response.data.data.list));
                })
                .catch((error) => {
                    if (error.response) {
                        dispatch(_obj.deleteDocumentError(error.response.data.response.errors.message));
                    } else {
                        dispatch(_obj.deleteDocumentError(error.message));
                    }
                });
        };
    },

    deleteDocumentStart: function () {
        return {
            type: actionTypes.DELETE_DOCUMENT
        }
    },

    deleteDocumentSuccess: function (data) {
        return {
            type: actionTypes.DELETE_DOCUMENT_SUCCESS,
            data
        }
    },

    deleteDocumentError: function (errorMsg) {
        return {
            type: actionTypes.DELETE_DOCUMENT_ERROR,
            errorMsg
        }
    },

    verifyChecking: function (token, cb) {
        return (dispatch) => {
            dispatch(this.verifyCheckingStart());

            setBearerToken(token);

            return axios.get("kyc/check")
                .then((response) => {
                    dispatch(this.verifyCheckingSuccess(response.data.data));
                    if (cb) cb();
                })
                .catch((error) => {
                    if (error.response) {
                        dispatch(this.verifyCheckingError(error.response.data.response.errors.message));
                    } else {
                        dispatch(this.verifyCheckingError(error.message));
                    }
                });
        };
    },

    verifyCheckingStart: function () {
        return {
            type: actionTypes.VERIFICATION_CHECKING
        }
    },

    verifyCheckingSuccess: function (data) {
        return {
            type: actionTypes.VERIFICATION_CHECKING_SUCCESS,
            data
        }
    },

    verifyCheckingError: function (errorMsg) {
        return {
            type: actionTypes.VERIFICATION_CHECKING_ERROR,
            errorMsg
        }
    },

    getDocuments: function (token, cb) {
        return (dispatch) => {
            dispatch(this.getDocumentsStart());

            setBearerToken(token);

            return axios.get("kyc/document")
                .then((response) => {
                    dispatch(this.getDocumentsSuccess(response.data.data));
                    if (cb) cb();
                })
                .catch((error) => {
                    if (error.response) {
                        dispatch(this.getDocumentsError(error.response.data.response.errors.message));
                    } else {
                        dispatch(this.getDocumentsError(error.message));
                    }
                });
        };
    },

    getDocumentsStart: function () {
        return {
            type: actionTypes.GET_DOCUMENTS
        }
    },

    getDocumentsSuccess: function (data) {
        return {
            type: actionTypes.GET_DOCUMENTS_SUCCESS,
            data
        }
    },

    getDocumentsError: function (errorMsg) {
        return {
            type: actionTypes.GET_DOCUMENTS_ERROR,
            errorMsg
        }
    },

};

export default KycActions;

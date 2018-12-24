import {Cookies} from 'react-cookie';

window.store = require('store');

export const normalizeCryptoAmount = function (amount, code) {
    let subunitExponent = 6;
    if (code === 'btc' || code === 'bch')
        subunitExponent = 8;

    return amount * Math.pow(10, -subunitExponent)
};

export const makeCryptoString = function (amount, code) {
    const precision = {
        maximumFractionDigits: 6,
        useGrouping: false
    };
    if (code === 'btc' || code === 'bch')
        precision.maximumFractionDigits = 8;

    return amount.toLocaleString(navigator.language, precision);
};

export const preZero = (n) => {
    return n < 10 ? "0" + n : n;
};

export const getTimeString = (date) => {
    if (date) {
        const dateTime = new Date(date);

        let hours = dateTime.getHours();
        const AP = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;

        return preZero(dateTime.getDate()) + "." + preZero(dateTime.getMonth() + 1) + "." + dateTime.getFullYear()
            + ", " + preZero(hours) + ":" + preZero(dateTime.getMinutes()) + " " + AP;
    } else {
        return '';
    }
};

export const customStyles = {
    overlay: {
        zIndex: 1000
    },
    content: {
        maxHeight: "100%",
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '100%',
        maxWidth: '650px',
        transform: 'translate(-50%, -50%)',
        border: '4px solid rgb(159, 139, 201)'
    }
};

export const getSubData = () => {
    const cookies = new Cookies;
    const sub_data = {};
    const mktParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content', 'oid', 'pid', 's1', 's2'];

    mktParams.forEach(mktParam => {
        const paramValue = cookies.get(mktParam);
        if (paramValue)
            sub_data[mktParam] = paramValue;
    });

    return Object.keys(sub_data).length && sub_data;
};

export const pushToGTM = (eventObject, storeKey) => {
   if (process.env.NODE_ENV !== "production")
        return;

    dataLayer = dataLayer || [];

    const sub_data = getSubData();
    if (sub_data)
        eventObject.sub_data = {
            ...eventObject.sub_data,
            ...sub_data
        };

    if (storeKey)
        store.set(storeKey, eventObject);

    dataLayer.push(eventObject);

    return eventObject;
};

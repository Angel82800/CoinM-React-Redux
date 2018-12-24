import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {persistStore} from 'redux-persist';

import configureStore from './redux/stores/configureStore';
import createRoutes from './containers/createRoutes';
import LoadingOverlay from './components/Common/LoadingOverlay';

const store = configureStore();
const rootRoute = createRoutes(store.getState);
const history = syncHistoryWithStore(hashHistory, store);

function scrollToTop() {
    window.scrollTo(0, 0);
}

export default class AppProvider extends Component {
    constructor() {
        super();

        this.state = {
            rehydrated: false
        };
    }

    componentWillMount() {
        persistStore(store, {blacklist: ['routing']}, () => {
            this.setState({
                rehydrated: true
            });
        });
    }

    render() {
        if (!this.state.rehydrated) {
            return (
                <LoadingOverlay overlayClass="overlay show" message=""/>
            );
        }

        return (
            <Provider store={store}>
                <Router
                    onUpdate={scrollToTop}
                    history={history}
                    routes={rootRoute}
                />
            </Provider>
        );
    }
}

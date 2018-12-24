import React from 'react';
import {render} from 'react-dom';
import ReactPixel from 'react-facebook-pixel';

import AppProvider from './AppProvider';

render (
    <AppProvider />,
    document.getElementById('app-container')
);

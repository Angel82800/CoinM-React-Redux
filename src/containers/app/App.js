import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import CookieBanner from "react-cookie-banner";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

injectTapEventPlugin(); // Needed for onTouchTap for Material UI

import TFAModal from "../../components/Modals/TFAModal";
import lightTheme from "./themes/lightTheme";

// Styles
import "styles/bootstrap.scss";
import "styles/layout.scss";
import "styles/theme.scss";
import "styles/ui.scss";
import "styles/app.scss";

export default class App extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightTheme)}>
                <div id="app-inner">
                    <div className="full-height fixed-header nav-behind">
                        <CookieBanner
                            message="To improve your experience, GO! Platform uses cookies."
                            onAccept={() => {}}
                            cookie="user-has-accepted-cookies"
                        />

                        {this.props.children}

                        <TFAModal/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

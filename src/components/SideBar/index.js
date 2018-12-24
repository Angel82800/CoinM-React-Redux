import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { AccountActions } from "../../redux/app/actions";

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileOpened: false,
      menu: "Dashboard",
      mobileMenuOpened: false
    };
  }

  changeMenu = (menu) => {
    this.setState({
      menu,
      mobileMenuOpened: false
    });
  };

  toggleProfile = () => {
    this.setState({
      profileOpened: !this.state.profileOpened
    });
  };

  toggleMobileMenu = () => {
    this.setState({
      mobileMenuOpened: !this.state.mobileMenuOpened
    });
  };

  signOut = () => {
    this.props.signOut({
      data: this.props.userToken,
    });
  };

  render() {
    const menus = [
      { link: "#/overview", name: "Overview", icon: "icon-speedometer" },
     // { link: "#/timeline", name: "Timeline", icon: "icon-clock" },
      { link: "#/ambassador", name: "Ambassador", icon: "icon-case" },
      { link: "#/settings/profile", name: "Profile", icon: "icon-profile" },
      { link: "#/settings/security", name: "Security", icon: "icon-security" },
      { link: "#/laboratory/do", name: "Academy", icon: "far fa-graduation-cap academy-icon" }
    ];

    const clsMobileMenu = this.state.mobileMenuOpened ? " opened" : "";

    return (
      <div className={"go-sidebar" + (this.props.collapsed ? " minimized" : "")}>
        <div className="go-sidebar-fixed">
          <div className="go-sidebar-toggle" onClick={this.props.changeCollapseState}>
            <i className="far fa-chevron-left" />
          </div>

          <div className={"go-mobile-menu-icon" + clsMobileMenu} onClick={this.toggleMobileMenu}>
            <i className="far fa-bars" /><i className="far fa-times" />
          </div>

          <div className="go-logo-container">
            <div className="go-logo"><img src="assets/img/logo-yellow.svg" alt="" /></div>
            <div className="go-logo-description"><img width="100%" src="assets/images/logo_expanded_new.png" alt="" /></div>
          </div>

          <div className={"go-mobile-navigation" + clsMobileMenu}>
            <div className="go-navigation">
              {menus.map((menu, index) => (
                <a key={index} href={menu.link}
                  className={this.props.location.pathname.includes(menu.link.slice(1)) ? "active" : ""}
                  onClick={() => this.changeMenu(menu.name)}
                >
                  <i className={menu.icon} /><span>{menu.name}</span>
                </a>
              ))}
            </div>

            <div className={"go-bottom-buttons" + (this.state.profileOpened ? " visible" : "")}>
              <a href="https://t.me/CoinMetro" target="_blank"
                className="go-button-blue go-button-reflect">
                <img src="assets/img/telegram-ico.png" className="go-button-telegram-icon" />
                <span>join our telegram</span>
              </a>

              {/*
              <a href="https://coinmetro.com/airdrop/" target="_blank"
                className="go-button-violet go-button-reflect">
                <img src="assets/img/airdrop-icon.png" className="go-button-airdrop-icon" />
                <span>join our airdrop</span>
              </a>
              */}

              <div className="go-profile-avatar-menu"><a onClick={this.signOut}>Log Out</a></div>

              <div className="go-profile-navigation" onClick={this.toggleProfile}>
                <div className="go-profile-avatar"><img src="assets/images/avatar.png" alt="" /></div>
                <div className="go-profile-name">{this.props.userData.firstname} {this.props.userData.lastname}</div>
                <div className="go-profile-open"><i className="far fa-chevron-left" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SideBar.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    userToken: state.userReducer.userToken,
    userId: state.userReducer.userId,
    userData: state.userReducer.userData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: (req) => dispatch(AccountActions.signOut(req.data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);

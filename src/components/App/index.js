import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn/index';
import SignOut from '../SignOut';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authUser: JSON.parse(localStorage.getItem('authUser'))
    };
  }

  render() {
    return (
      <Router>
        <div className="contaner-flex">
          <Navigation />
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return (
                  this.state.authUser === null ?
                  <Redirect to="/signin" /> :
                  <Redirect to="/home" />
                )
              }}
            />

            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.SIGN_OUT} component={SignOut} />
          </Switch>
        </div>
      </Router>
    )
  }
};

export default withAuthentication(App);

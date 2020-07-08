import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { UserList, UserItem } from '../Users';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const AdminPage = () => (
    <Switch>
      <Route exact path={ROUTES.ACCOUNT_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADD_ACCOUNT} component={UserItem} />
      <Route exact path={ROUTES.LIST_ACCOUNTS} component={UserList} />
    </Switch>
);

const condition = authUser =>
  authUser && ROLES.ADMIN;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage);

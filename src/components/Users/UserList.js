import React, { Component } from 'react';
import Table from 'material-table';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  handleEdit = (event, rowData) => {
    // window.open(`${ROUTES.ADMIN}/${rowData.id}`,"_blank");
    this.props.history.push(`${ROUTES.ADMIN}/${rowData.id}`);
  }

  render() {
    const { users, loading } = this.state;
    return (
      <div className="content-main">
      <Table
        title="List Accounts"
        data={users}
        columns={[
        { title: 'First Name', field: 'firstName' },
        { title: 'Last Name', field: 'lastName' },
        { title: 'Full Name', field: 'fullName'},
        { title: 'Phone', field: 'phone', type: 'numeric'},
        { title: 'Role', field: 'role'},
        ]}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit User',
            onClick: (event, rowData) => this.handleEdit(event, rowData)
          },
          {
            icon: 'delete',
            tooltip: 'Delete User',
            onClick: (event, rowData) => console.log("$$")
          }
        ]}
        options={{
          actionsColumnIndex: -1
        }}
        />
        </div>
    );
  }
}

export default withFirebase(UserList);

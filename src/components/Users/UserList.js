import React, { Component, forwardRef } from 'react';
import Table from 'material-table';
import swal from 'sweetalert'

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Button } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

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
    this.props.history.push(`${ROUTES.LIST_ACCOUNTS}/${rowData.uid}`);
  }

  handleDelete = (event, rowData) => {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let itemRef = this.props.firebase.user(rowData.uid)
        itemRef.remove()
        .then(() => {
          swal("Deleted!", "this user has been deleted.", "success");
        })
        .catch((error) => {
          swal("this user not exist!");
        })
      } else {
        swal("Your imaginary file is safe!");
      }
    })
  }

  render() {
    const { users, loading } = this.state;
    return (
      <div className="content-main">
      <Table
        title="List Accounts"
        icons={{Add: props => <AddBoxIcon/>
        //   <Button 
        //   variant="contained"
        //   color="secondary"
        //   className="mr-3"
        //   startIcon={<AddBoxIcon/>}
        //   // onClick={this.handleCancle}
        //   >
        //     NEW USER
        //   </Button> 
        // )
      }}
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
            onClick: (event, rowData) => this.handleDelete(event, rowData)
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

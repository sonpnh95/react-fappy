import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import swal from 'sweetalert';

import * as Routes from '../../constants/routes'

import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader
}
  from '@material-ui/core';
  import { Cancel, Save } from '@material-ui/icons';

class UserItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      editMode: true,
      user: null,
      ...props.location.state,
      passwordConfirm: "",
      showPasswordConfirm: false,
      errors: {
        firstName: false,
        lastName: false,
        password: false,
        phone: false,
        role: false,
        sellerId: false,
      }
    };
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          editMode: true,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  hadleChange = (event) => {
    let { user } = this.state
    let stateValue = event.target.value
    let stateName = event.target.name

    user[stateName] = stateValue
    this.handleUpdate(stateName, user)
    this.setState({user})
  }

  handleUpdate = (stateName, user) => {
    switch (stateName) {
      case "firstName":
      case "lastName":
        user["fullName"] = user.lastName + " " + user.firstName
        break;
      default:
        break;
    }
    this.setState({user})
  }

  handleSave = () => {
    let isValid = true
    let { user, errors, showPasswordConfirm, passwordConfirm } = this.state

    if (showPasswordConfirm) {
      user.passwordConfirm = user.password === passwordConfirm ? passwordConfirm : ""
    } else {
      delete user.passwordConfirm
    }

    console.log(user)
    Object.keys(user).forEach((key) => {
      if (user[key] === "" && key !== "password") {
        errors[key] = true
      } else {
        errors[key] = false
      }
    })
    this.setState({errors})

    Object.keys(errors).forEach((key) => errors[key] === true && (isValid = false))

    if (isValid) {
      delete user.passwordConfirm
      this.updateUser(user)
    } else {
      swal("this user has data incorrect!");
    }
  }

  updateUser = (user) => {
    const { loading } = this.state
    let refUser = this.props.firebase.user(this.props.match.params.id)
    this.setState({ loading: true })

    refUser.update(user)
    .then(() => {
      this.setState({ loading: false, showPasswordConfirm: false })
      swal("this user updated sucess", "You clicked the button!", "success");
    })
    .catch((error) => {
      this.setState({ loading: false })
      swal("update user incorrect");
    })

  }

  hadleChangePassword = (event) => {
    let { user } = this.state
    let currentPassword = user.password
    let stateValue = event.target.value
    let stateName = event.target.name

    if (stateName === "password") {
      if (stateValue !== currentPassword) {
        user[stateName] = stateValue
        this.setState({showPasswordConfirm: true, user})
      } else {
        swal("New password must be different from the old password");
      }
    } else {
      this.setState({passwordConfirm: stateValue})  
    }
  }

  handleCancle = () => {
    this.props.history.push(Routes.LIST_ACCOUNTS)
  }

  render() {
    const { user, loading, passwordConfirm, editMode, errors, showPasswordConfirm } = this.state;

    return (
      user &&
      <Grid item xs={12} sm={10} md={10} className="form-margin">
        <Card className="position-relative overflow-unset p-5">
          <CardHeader 
            color="rose"
            title={"Detail User: " + user.fullName}
            className="form-title-box rounded"
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  error={errors.firstName}
                  name="firstName"
                  value={user.firstName}
                  label="First Name"
                  onChange={(event) => this.hadleChange(event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  error={errors.lastName}
                  name="lastName"
                  value={user.lastName}
                  label="Last Name"
                  onChange={(event) => this.hadleChange(event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="fullName"
                  value={user.fullName}
                  label="Full Name"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="phone"
                  error={errors.phone}
                  value={user.phone}
                  label="Phone Number"
                  onChange={(event) => this.hadleChange(event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  error={errors.role}
                  name="role"
                  value={user.role}
                  label="Role"
                  onChange={(event) => this.hadleChange(event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  error={errors.sellerId}
                  name="sellerId"
                  value={user.sellerId}
                  label="Seller"
                  onChange={(event) => this.hadleChange(event)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  error={errors.password}
                  type="password"
                  name="password" 
                  value={user.password}
                  label="Password" 
                  onChange={(event) => this.hadleChangePassword(event)}
                  fullWidth 
                />
              </Grid>

              {showPasswordConfirm && 
                <Grid item xs={12} sm={6}>
                  <TextField 
                    type="password"
                    error={errors.passwordConfirm}
                    name="passwordConfirm" 
                    value={passwordConfirm}
                    onChange={(event) => this.hadleChangePassword(event)}
                    label="Password Confirm" 
                    fullWidth 
                  />
                </Grid>
              }
              <Grid className="d-flex justify-content-end w-100 m-4">
                <Button
                  variant="contained"
                  color="secondary"
                  className="mr-3"
                  startIcon={<Cancel/>}
                  onClick={this.handleCancle}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Save/>}
                  onClick={this.handleSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withFirebase(UserItem);

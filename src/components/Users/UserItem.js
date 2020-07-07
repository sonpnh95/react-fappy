import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { 
  Container, 
  Card,
  CardHeader,
  CardContent,
  Grid } 
  from '@material-ui/core';

class UserItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
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
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  render() {
    const { user, loading } = this.state;

    return (
      <div>
      {user && 
        <Container fixed className="my-5">
          <Card>
          
            <CardHeader 
              title="asss"
            >
              
            </CardHeader>
            <CardContent>
              <Grid item xs={12}>
              Details User: {user && user.fullName}
              </Grid>
            </CardContent>
           
          </Card>
        </Container>
      }
      </div>

      // <div>
      //   <h2>User ({this.props.match.params.id})</h2>
      //   {loading && <div>Loading ...</div>}

      //   {user && (
      //     <div>
      //       <span>
      //         <strong>ID:</strong> {user.uid}
      //       </span>
      //       <span>
      //         <strong>E-Mail:</strong> {user.email}
      //       </span>
      //       <span>
      //         <strong>Username:</strong> {user.username}
      //       </span>
      //       <span>
      //         <button
      //           type="button"
      //           onClick={this.onSendPasswordResetEmail}
      //         >
      //           Send Password Reset
      //         </button>
      //       </span>
      //     </div>
      //   )}
      // </div>
    );
  }
}

export default withFirebase(UserItem);

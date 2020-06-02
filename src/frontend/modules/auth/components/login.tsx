import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import "../scss/login.scss";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { API_HOST, API_LOGIN } from '../../util/api-routes';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { RoutesProps } from '../../root/components/routes';

export interface LoginProps extends WithSnackbarProps, RoutesProps {
}

@observer
class LoginComponent extends React.Component<LoginProps> {
  @observable private username: string = "";
  @observable private password: string = "";

  private async apiLogIn(): Promise<void> {
    if(this.username.trim().length === 0) {
      this.props.enqueueSnackbar("Username cannot be blank or consist of just spaces!", {
        variant: "warning"
      });
      return;
    }
    if(this.password.trim().length === 0) {
      this.props.enqueueSnackbar("Password cannot be blank or consist of just spaces!", {
        variant: "warning"
      });
      return;
    }
    const response = await fetch(`${API_HOST}${API_LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });
    const tokenPayload = await response.json();
    if(tokenPayload.failed) {
      // We have encountered an error, duh!
      console.error(tokenPayload);
      this.props.enqueueSnackbar(tokenPayload.reason, {
        variant: "error"
      });
      return;
    } 

    localStorage.setItem('jwtKey', tokenPayload.token);
    // same reason as register.tsx, hard-reload
    window.location.pathname = "/";
  }

  public componentDidMount(): void {
    this.props.changeTitle("Login to EZDo");
  }

  public render() {
    return (
      <section className="login">
        <section className="form-container">
          <Typography variant="h4">Login</Typography>
          <Typography variant="subtitle2">
            If you don't have one yet, <Link to="/register">create one now</Link>!
          </Typography>
          <form className="form" onSubmit={(ev) => { this.apiLogIn(); ev.preventDefault(); }}>
            <TextField margin="normal"
              variant="filled"
              label="username"
              placeholder="johndoe1337"
              onChange={ev => this.username = ev.target.value}
              value={this.username}
              fullWidth />
            <br />
            <TextField
              type="password"
              margin="normal"
              variant="filled"
              label="password"
              placeholder="supersecret pass"
              value={this.password}
              onChange={ev => this.password = ev.target.value}
              fullWidth />
            <br />
            <br />
            <Button size="large" variant="contained" type="submit" color="secondary">
              Login
            </Button>
          </form>
        </section>
      </section>
    )
  }
}

export const Login = withSnackbar(LoginComponent);
import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import "../scss/register.scss";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { API_HOST, API_REGISTER } from '../../util/api-routes';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RoutesProps } from '../../root/components/routes';

@observer
class RegisterComponent extends React.Component<WithSnackbarProps & RoutesProps> {
  @observable private username: string = "";
  @observable private password: string = "";
  @observable private passwordRe: string = "";

  private async apiRegister(): Promise<void> {
    if(this.username.trim().length === 0) {
      this.props.enqueueSnackbar("Username cannot be blank or consist of just spaces!", {
        variant: "warning"
      });
    }
    if(this.password !== this.passwordRe) {
      this.props.enqueueSnackbar("Passwords do not match", {
        variant: "warning",
      });
      return;
    }

    const response = await fetch(`${API_HOST}${API_REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });
    const tokenPayload = await response.json();

    if(tokenPayload.failed) {
      console.log(tokenPayload);
      this.props.enqueueSnackbar(tokenPayload.reason, {
        variant: "error",
      });
      return;
    }

    localStorage.setItem('jwtKey', tokenPayload.token);
    // Hard reload, otherwise the localStorage dependent stuff in Navbar.tsx would not update
    window.location.pathname = "/";
  }

  public componentDidMount() {
    this.props.changeTitle("Register for an account - EZDo");
  }

  public render() {
    return (
      <section className="register">
        <section className="form-container">
          <Typography variant="h4">
            Register
          </Typography>
          <Typography variant="subtitle2">
            for an account
          </Typography>
          <section className="form">
            <TextField
              margin="normal"
              variant="filled"
              label="username"
              value={this.username}
              placeholder="johndoe1337"
              onChange={ev => this.username = ev.target.value}
              fullWidth />
            <br />
            <TextField
              margin="normal"
              variant="filled"
              label="password"
              type="password"
              value={this.password}
              placeholder="supersecret pass"
              onChange={ev => this.password = ev.target.value}
              fullWidth />
            <br />
            <TextField
              margin="normal"
              variant="filled"
              label="confirm password"
              type="password"
              value={this.passwordRe}
              placeholder="supersecret pass"
              onChange={ev => this.passwordRe = ev.target.value}
              fullWidth />
            <br />
            <br />
            <Button variant="contained" color="secondary" size="medium" onClick={() => this.apiRegister()}>
              Register
            </Button>
          </section>
        </section>
      </section>
    );
  }
}

export const Register = withSnackbar(RegisterComponent);
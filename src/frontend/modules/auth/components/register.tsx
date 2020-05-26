import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import "../scss/register.scss";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { API_HOST, API_REGISTER } from '../../util/api-routes';

@observer
export class Register extends React.Component<{}> {
  @observable private username: string = "";
  @observable private password: string = "";
  @observable private passwordRe: string = "";

  private async apiRegister(): Promise<void> {
    if(this.password !== this.passwordRe) return;

    const response = await fetch(`${API_HOST}${API_REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });
    const tokenPayload = await response.json();

    localStorage.setItem('jwtKey', tokenPayload.token);
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
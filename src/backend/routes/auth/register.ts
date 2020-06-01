import * as express from 'express';
import { ErrorEnums } from '../../error-enums';
import { checkIfUserExists } from '../../util';
import { User } from '../../entities/user';
import { hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export async function register(req: express.Request, res: express.Response): Promise<void> {
  const { username, password } = req.body;

  const connection = req.db;
  const users = connection.getRepository(User);

  if(await checkIfUserExists(connection, username)) {
    res.json({ failed: true, reason: "User with that username already exists", errorEnum: ErrorEnums.UserAlreadyExists });
    return;
  }

  users.insert({
    username,
    password: await hash(password, 8)
  });

  res.json({
    token: jwt.sign({user: username}, '0a8d5fec-f42d-4a00-aa01-cd1a5aded672')
  });
}
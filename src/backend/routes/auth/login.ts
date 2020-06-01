import * as express from 'express';
import { User } from '../../entities/user';
import { ErrorEnums } from '../../error-enums';
import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export async function login(req: express.Request, res: express.Response): Promise<void> {
  const { username, password } = req.body;

  const connection = req.db;
  const users = connection.getRepository(User);

  const user = await users.findOne({ username });

  if(!user) {
    res.json({ failed: true, reason: "No matching records found", errorEnum: ErrorEnums.UserDoesNotExist });
    return;
  }
  const passwordFromDB = user.password;
  if(await compare(password, passwordFromDB)) {
    res.json({
      success: true,
      token: jwt.sign({user: username}, '0a8d5fec-f42d-4a00-aa01-cd1a5aded672')
    });
  } else {
    res.json({ failed: true, reason: "Password for user does not match", errorEnum: ErrorEnums.InvalidUserCredentials });
  }
}
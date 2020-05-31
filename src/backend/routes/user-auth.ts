import * as express from 'express';
import { User } from '../entities/user';
import { hash, compare } from 'bcrypt';
import { checkIfUserExists } from '../util';
import { ErrorEnums } from '../error-enums';
import * as jwt from 'jsonwebtoken';

const router = express.Router({});

router.post('/login', async (req: express.Request, res: express.Response) => {
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
});

router.post('/register', async (req: express.Request, res: express.Response) => {
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
});

export { router as UserAuthRouter };
import * as express from 'express';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { invalidToken } from '../commons/invalid-token';

export async function username(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);

    res.json({
      success: true,
      username
    });
  } catch (e) {
    invalidToken(res);
    return;
  }
}
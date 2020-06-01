import * as express from 'express';
import { ErrorEnums } from '../../error-enums';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { User } from '../../entities/user';
import { Groups } from '../../entities/groups';
import { invalidToken } from '../commons/invalid-token';

export async function createGroup(req: express.Request, res: express.Response) {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const users = req.db.getRepository(User);
    const groups = req.db.getRepository(Groups);
    
    const user = await users.findOne({ username: username });
    if(!user) {
      res.status(404);
      res.json({ failed: true, reason: "No groups found for this user", errorEnum: ErrorEnums.NoGroupsFound });
      return;
    }

    const { name } = req.body;
    const insertResult = await groups.insert({ createdBy: username, name });

    res.json({
      success: true,
      group: insertResult.identifiers
    });

  } catch (e) {
    invalidToken(res);
    return;
  }
}
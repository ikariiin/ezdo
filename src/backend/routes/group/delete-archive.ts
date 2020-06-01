import * as express from 'express';
import { ErrorEnums } from '../../error-enums';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { User } from '../../entities/user';
import { Todo } from '../../entities/todo';
import { invalidToken } from '../commons/invalid-token';

export async function deleteArchive(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }
  
  try {
    const username = getUsernameFromJWT(jwtKey);
    const users = req.db.getRepository(User);
    const todos = req.db.getRepository(Todo);

    const user = await users.findOne({ username: username });
    if(!user) {
      res.status(404);
      res.json({ failed: true, reason: "No groups found for this user", errorEnum: ErrorEnums.NoGroupsFound });
      return;
    }
    const removalResult = await todos.delete({
      author: username,
      group: -1
    });

    res.json({
      success: true,
      removalResult
    });
    req.logger.info(`${username} cleared the archive.`);
  } catch(e) {
    invalidToken(res);
    return;
  }
}
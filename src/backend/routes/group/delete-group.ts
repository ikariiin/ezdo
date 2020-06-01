import * as express from 'express';
import { ErrorEnums } from '../../error-enums';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { User } from '../../entities/user';
import { Groups } from '../../entities/groups';
import { Todo } from '../../entities/todo';
import { invalidToken } from '../commons/invalid-token';

export async function deleteGroup(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const users = req.db.getRepository(User);
    const groups = req.db.getRepository(Groups);
    const todos = req.db.getRepository(Todo);
    
    const user = await users.findOne({ username: username });
    if(!user) {
      res.status(404);
      res.json({ failed: true, reason: "No groups found for this user", errorEnum: ErrorEnums.NoGroupsFound });
      return;
    }

    const { groupId } = req.params;
    todos.update({
      group: Number(groupId)
    }, {
      group: -1
    });

    const removalResult = await groups.delete({
      id: Number(groupId)
    });

    res.json({
      success: true,
      removalResult
    });
    req.logger.info(`${username} deleted group #${groupId}.`)
  } catch (e) {
    invalidToken(res);
    return;
  }
};
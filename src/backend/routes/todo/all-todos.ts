import * as express from 'express';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { Todo } from '../../entities/todo';
import { invalidToken } from '../commons/invalid-token';

export async function allTodos(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const groupId = req.params.groupId;

    const connection = req.db;
    const todos = connection.getRepository(Todo);

    res.json(
      await todos.find({
        where: { author: username, group: groupId },
      })
    );
  } catch(e) {
    invalidToken(res);
    return;
  }
}
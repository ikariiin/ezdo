import * as express from 'express';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { Todo } from '../../entities/todo';
import { invalidToken } from '../commons/invalid-token';

export async function createTodo(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }
  
  const { groupId, date, label, task, images } = req.body;
  try {
    const username = getUsernameFromJWT(jwtKey);

    const connection = req.db;
    const todos = connection.getRepository(Todo);
    
    const insertResult = todos.insert({
      dueDate: date,
      group: groupId,
      author: username,
      label,
      task,
      images
    });

    res.json({
      success: true,
      todo: insertResult
    });
  } catch(e) {
    invalidToken(res);
    return;
  }
}
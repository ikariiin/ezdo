import * as express from 'express';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { Todo } from '../../entities/todo';
import { ErrorEnums } from '../../error-enums';
import { invalidToken } from '../commons/invalid-token';

export async function getTodo(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { todoId } = req.params;

    const specifiedTodo = await todos.findOne({
      where: {
        id: Number(todoId)
      }
    });

    if(!specifiedTodo) {
      res.status(404);
      res.json({
        failed: true,
        reason: "Todo with the id provided not found",
        errorEnum: ErrorEnums.TodoNotFound
      });
      return;
    }

    if(specifiedTodo.author !== username) {
      res.status(401);
      res.json({
        failed: true,
        reason: "User is not authorized to modify the todo",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    res.json({
      success: true,
      todo: specifiedTodo
    });
  } catch (e) {
    invalidToken(e);
    return;
  }
}
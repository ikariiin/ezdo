import * as express from 'express';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { Todo } from '../../entities/todo';
import { Like } from 'typeorm';
import { invalidToken } from '../commons/invalid-token';

// Redeclare it here because we cannot import UI files in here which require other non-js modules
// such as scss.
enum SearchCategory {
  Task = "Task",
  Label = "Label",
  Group = "Group"
}

export async function searchAll(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }
  
  try {
    const username = getUsernameFromJWT(jwtKey);
    const connection = req.db;
    const todos = connection.getRepository(Todo);
    const { category, searchTerm } = req.params;

    const categoryClause: {
      task?: any,
      label?: any,
      group?: any
    } = {};
    if(category === SearchCategory.Task) { categoryClause.task = Like(`%${searchTerm}%`); }
    if(category === SearchCategory.Group) { categoryClause.group = Like(`%${searchTerm}%`); }
    if(category === SearchCategory.Label) { categoryClause.label = Like(`%${searchTerm}%`); }

    const searchResult = await todos.find({
      where: {
        author: username,
        ...categoryClause
      }
    });

    res.json({
      success: true,
      searchResult
    });
  } catch(e) {
    invalidToken(res);
    return;
  }
}
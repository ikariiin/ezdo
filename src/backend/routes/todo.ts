import * as express from 'express';
import { getUsernameFromJWT } from '../util';
import { Todo } from '../entities/todo';
import { ErrorEnums } from '../error-enums';
import { Like } from 'typeorm';
import { createTodo } from './todo/create-todo';
import { allTodos } from './todo/all-todos';
import { editTodoLabel } from './todo/edit-todo-label';
import { deleteTodo } from './todo/delete-todo';
import { getTodo } from './todo/get-todo';
import { searchAll } from './todo/search-all';
import { editTodo } from './todo/edit-todo';
import { moveTodo } from './todo/move-todo';
import { deleteTodoLabel } from './todo/delete-todo-label';
import { archiveTodo } from './todo/archive-todo';

const router = express.Router();

router.post("/create", createTodo);

router.get("/:groupId/all", allTodos);

router.put("/label/:todoId", editTodoLabel);

router.delete('/delete/:todoId', deleteTodo);

router.get("/:todoId", getTodo);

router.get("/search/:category/:searchTerm", searchAll)

router.put("/:todoId", editTodo);

router.patch("/move/:todoId", moveTodo);

router.delete("/:todoId/label/:labelIndex", deleteTodoLabel);

router.patch("/:todoId/archive", archiveTodo);

export { router as TodoRouter };
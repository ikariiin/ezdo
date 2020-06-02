import * as express from 'express';
import { getGroups } from './group/get-groups';
import { deleteArchive } from './group/delete-archive';
import { createGroup } from './group/create-group';
import { deleteGroup } from './group/delete-group';
import { getGroupTodo } from './group/get-group-todo';
import { searchGroups } from './group/search-groups';

const router = express.Router();

router.get('/', getGroups);

router.post("/", createGroup);

router.delete("/archive", deleteArchive);

router.delete("/:groupId", deleteGroup);

router.get("/:groupId", getGroupTodo);

router.get("/search/:groupName", searchGroups);

export { router as GroupRouter };
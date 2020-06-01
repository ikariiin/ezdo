import * as express from 'express';
import { getUsernameFromJWT } from '../util';
import { User } from '../entities/user';
import { Groups } from '../entities/groups';
import { ErrorEnums } from '../error-enums';
import { Todo } from '../entities/todo';
import { Like } from 'typeorm';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
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

    const userGroups = await groups.find({ createdBy: user.username });
    res.json(userGroups);
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
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
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.delete("/archive", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
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
  } catch(e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.delete("/:groupId", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
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
  } catch (e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
})

router.get("/:groupId", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }
  
  try {
    const username = getUsernameFromJWT(jwtKey);
    const users = req.db.getRepository(User);
    const todos = req.db.getRepository(Todo);
    const { groupId } = req.params;
      
    const user = await users.findOne({ username: username });
    if(!user) {
      res.status(404);
      res.json({ failed: true, reason: "No groups found for this user", errorEnum: ErrorEnums.NoGroupsFound });
      return;
    }

    const tasks = await todos.find({
      where: {
        group: Number(groupId),
        author: username
      }
    });

    res.json({
      success: true,
      tasks
    });
  } catch(e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

router.get("/search/:groupName", async (req: express.Request, res: express.Response) => {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    res.status(401);
    res.json({
      failed: true,
      reason: "User is not authorized to request this content",
      errorEnum: ErrorEnums.UserNotAuthorized
    });
    return;
  }
  
  try {
    const username = getUsernameFromJWT(jwtKey);
    const users = req.db.getRepository(User);
    const groups = req.db.getRepository(Groups);
    const { groupName } = req.params;
      
    const user = await users.findOne({ username: username });
    if(!user) {
      res.status(404);
      res.json({ failed: true, reason: "No groups found for this user", errorEnum: ErrorEnums.NoGroupsFound });
      return;
    }

    const searchResult = await groups.find({
      where: {
        createdBy: username,
        name: Like(`%${groupName}%`)
      }
    });

    res.json({
      success: true,
      searchResult
    });
  } catch(e) {
    res.status(401);
    res.json({
      failed: true,
      reason: "Token for authorization is invalid",
      errorEnum: ErrorEnums.TokenInvalid
    });
    return;
  }
});

export { router as GroupRouter };
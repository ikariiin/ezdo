import { ErrorEnums } from "../../error-enums";
import { getUsernameFromJWT } from "../../util";
import * as express from 'express';
import { User } from "../../entities/user";
import { Groups } from "../../entities/groups";
import { invalidToken } from "../commons/invalid-token";
import { unauthorizedUser } from "../commons/unauthorized-user";

export async function getGroups(req: express.Request, res: express.Response): Promise<void> {
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

    const userGroups = await groups.find({ createdBy: user.username });
    res.json(userGroups);
  } catch (e) {
    invalidToken(res);
    return;
  }
}
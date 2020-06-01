import * as express from 'express';
import { ErrorEnums } from '../../error-enums';
import { unauthorizedUser } from '../commons/unauthorized-user';
import { getUsernameFromJWT } from '../../util';
import { User } from '../../entities/user';
import { Groups } from '../../entities/groups';
import { Like } from 'typeorm';
import { invalidToken } from '../commons/invalid-token';

export async function searchGroups(req: express.Request, res: express.Response): Promise<void> {
  const jwtKey = req.headers.authorization;
  if(!jwtKey) {
    unauthorizedUser(res);
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
    invalidToken(res);
    return;
  }
}
import { Request, Response } from "express";
import { unauthorizedUser } from "../commons/unauthorized-user";
import { getUsernameFromJWT } from "../../util";
import { invalidToken } from "../commons/invalid-token";
import { Image } from "../../entities/image";
import { join } from 'path';
import { ErrorEnums } from "../../error-enums";

export async function create(req: Request, res: Response): Promise<void> {
  const jwtKey = req.headers.authorization;

  if(!jwtKey) {
    unauthorizedUser(res);
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const images = req.db.getRepository(Image);

    if(!process.env.IMAGE_STORE_FS) {
      res.json({
        failed: true,
        errorEnum: ErrorEnums.ImageNotSaved,
        reason: "Could not find env variable for image store."
      });
      return;
    }

    const insertResult = await images.insert({
      createdAt: new Date(),
      createdBy: username,
      filePath: join(process.env.IMAGE_STORE_FS, req.imageStoreName)
    });
    
    res.json({
      success: true,
      id: insertResult.identifiers[0].id
    });
  } catch(e) {
    console.error(e);
    
    invalidToken(res);
    return;
  }
}
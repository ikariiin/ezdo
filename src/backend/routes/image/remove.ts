import { Request, Response } from "express";
import { unauthorizedUser } from "../commons/unauthorized-user";
import { invalidToken } from "../commons/invalid-token";
import { getUsernameFromJWT } from "../../util";
import { Image } from "../../entities/image";
import { ErrorEnums } from "../../error-enums";

export async function remove(request: Request, response: Response) {
  const jwtKey = request.headers.authorization;
  if(!jwtKey) {
    unauthorizedUser(response);
    return;
  }

  try {
    const username = getUsernameFromJWT(jwtKey);
    const images = request.db.getRepository(Image);

    const { id } = request.params;
    const specifiedImage = await images.findOne({
      id: Number(id)
    });
    
    if(!specifiedImage) {
      response.json({
        failed: true,
        reason: "Image not found.",
        errorEnum: ErrorEnums.ImageNotFound
      });
      return;
    }
    if(specifiedImage.createdBy !== username) {
      response.json({
        failed: true,
        reason: "User is not authorized to delete this image.",
        errorEnum: ErrorEnums.UserNotAuthorized
      });
      return;
    }

    await images.delete({
      id: Number(id)
    });

    response.json({
      success: true
    });
  } catch(e) {
    invalidToken(response);
    return;
  }
}
import { Request, Response } from "express";
import { Image } from "../../entities/image";
import { ErrorEnums } from "../../error-enums";

export async function getImage(request: Request, response: Response): Promise<void> {
  const images = request.db.getRepository(Image);
  const { id } = request.params;

  const specifiedImage = await images.findOne({
    id: Number(id)
  });

  if(!specifiedImage) {
    response.status(404);
    response.json({
      failed: true,
      reason: "Image does not exist.",
      errorEnum: ErrorEnums.ImageNotFound
    });
    return;
  }

  response.sendFile(specifiedImage.filePath);
}
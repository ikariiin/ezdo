import { Response } from 'express';
import { ErrorEnums } from '../../error-enums';

export function unauthorizedUser(res: Response): void {
  res.status(401);
  res.json({
    failed: true,
    reason: "User is not authorized to request this content",
    errorEnum: ErrorEnums.UserNotAuthorized
  });
}
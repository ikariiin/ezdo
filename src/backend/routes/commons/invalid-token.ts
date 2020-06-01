import { Response } from 'express';
import { ErrorEnums } from '../../error-enums';

export function invalidToken(res: Response): void {
  res.status(401);
  res.json({
    failed: true,
    reason: "Token for authorization is invalid",
    errorEnum: ErrorEnums.TokenInvalid
  });
}
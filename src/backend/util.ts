import * as jwt from 'jsonwebtoken';
import { Connection } from 'typeorm';
import { User } from './entities/user';

export function getUsernameFromJWT(jwtToken: string): string {
  const token: any = jwt.verify(jwtToken, 'peepee-poopoo-secret-ftw');
  
  return token.user;
}

export async function checkIfUserExists(connection: Connection, username: string): Promise<boolean> {
  const users = connection.getRepository(User);
  const found = await users.findOne({ username });

  return Boolean(found);
}
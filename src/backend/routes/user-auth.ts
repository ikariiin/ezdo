import * as express from 'express';
import { login } from './auth/login';
import { register } from './auth/register';
import { username } from './auth/username';

const router = express.Router({});

router.post('/login', login);

router.post('/register', register);

router.get('/username', username);

export { router as UserAuthRouter };
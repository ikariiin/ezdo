import * as express from 'express';
import { login } from './auth/login';
import { register } from './auth/register';

const router = express.Router({});

router.post('/login', login);

router.post('/register', register);

export { router as UserAuthRouter };
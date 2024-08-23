import { Router } from 'express';

import users from './User/User.route';

const router: Router = Router();

router.use('/users', users);

export default router;

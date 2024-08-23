import { Router } from 'express';

import users from './User/User.route';
import units from './Unit/Unit.route';

const router: Router = Router();

router.use('/users', users);
router.use('/units', units);

export default router;
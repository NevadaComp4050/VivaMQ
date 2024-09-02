import { Router } from 'express';

import users from './User/User.route';
import units from './Unit/Unit.route';
import tutors from './Tutor/Tutor.route';

const router: Router = Router();

router.use('/users', users);
router.use('/units', units);
router.use('/tutors', tutors);

export default router;
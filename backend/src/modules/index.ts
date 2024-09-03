import { Router } from 'express';

import users from './User/User.route';
import units from './Unit/Unit.route';
import tutors from './Tutor/Tutor.route';
import students from './Student/Student.route';
import assignments from './Assignment/Assignment.route';


const router: Router = Router();

router.use('/users', users);
router.use('/units', units);
router.use('/tutors', tutors);
router.use('/students', students);
router.use('/assignments', assignments);


export default router;
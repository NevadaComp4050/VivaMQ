import { Router } from 'express';

import users from './User/User.route';
import units from './Unit/Unit.route';
import tutors from './Tutor/Tutor.route';
import students from './Student/Student.route';
import assignments from './Assignment/assignment.route';
import submissions from './Submission/Submission.route';
import vivaQuestions from './VivaQuestion/VivaQuestion.route';

import misc from './misc.route';

const router: Router = Router();

router.use('/user', users);
router.use('/units', units);
router.use('/tutors', tutors);
router.use('/students', students);
router.use('/assignments', assignments);
router.use('/submissions', submissions);
router.use('/viva-questions', vivaQuestions);

router.use('/misc', misc);

export default router;

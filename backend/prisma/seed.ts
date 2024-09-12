import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import logger from '../src/lib/logger';
import { HR } from '../src/utils/helper';

const prisma = new PrismaClient();

const seedUsers = async (): Promise<void> => {
  const users = await prisma.user.createMany({
    data: [
      {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: faker.internet.password(),
        role: Role.ADMIN,
      },
      {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: faker.internet.password(),
        role: Role.TEACHER,
      },
      {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: faker.internet.password(),
        role: Role.STUDENT,
      },
    ],
  });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: User
    \rcount: ${users.count}
    \r${HR('white', '-', 30)}
  `);
};

const seedUnits = async (): Promise<void> => {
  const teacher = await prisma.user.findFirst({ where: { role: Role.TEACHER } });

  if (!teacher) throw new Error('Teacher not found');

  const unit = await prisma.unit.create({
    data: {
      id: faker.datatype.uuid(),
      name: faker.commerce.department(),
      year: new Date().getFullYear(),
      convenorId: teacher.id,
    },
  });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: Unit
    \rUnit Name: ${unit.name}
    \r${HR('white', '-', 30)}
  `);
};

const seedTutors = async (): Promise<void> => {
  const unit = await prisma.unit.findFirst();

  if (!unit) throw new Error('Unit not found');

  const tutor = await prisma.tutor.create({
    data: {
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      unitId: unit.id,
    },
  });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: Tutor
    \rTutor Name: ${tutor.name}
    \r${HR('white', '-', 30)}
  `);
};

const seedStudents = async (): Promise<void> => {
  const student = await prisma.student.create({
    data: {
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
  });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: Student
    \rStudent Name: ${student.name}
    \r${HR('white', '-', 30)}
  `);
};

const seedAssignments = async (): Promise<void> => {
  const unit = await prisma.unit.findFirst();

  if (!unit) throw new Error('Unit not found');

  const assignment = await prisma.assignment.create({
    data: {
      id: faker.datatype.uuid(),
      name: faker.company.bs(),
      aiModel: faker.hacker.abbreviation(),
      specs: faker.lorem.sentences(2),
      settings: faker.lorem.words(5),
      unitId: unit.id,
    },
  });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: Assignment
    \rAssignment Name: ${assignment.name}
    \r${HR('white', '-', 30)}
  `);
};

const seedSubmissions = async (): Promise<void> => {
  const assignment = await prisma.assignment.findFirst();
  const student = await prisma.student.findFirst();

  if (!assignment || !student) throw new Error('Assignment or student not found');

  const submission = await prisma.submission.create({
    data: {
      id: faker.datatype.uuid(),
      assignmentId: assignment.id,
      studentId: student.id,
      submissionFile: faker.system.filePath(),
      status: 'SUBMITTED',
    },
  });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: Submission
    \rSubmission ID: ${submission.id}
    \r${HR('white', '-', 30)}
  `);
};

const seedVivaQuestions = async (): Promise<void> => {
  const submission = await prisma.submission.findFirst();

  if (!submission) throw new Error('Submission not found');

  const vivaQuestion = await prisma.vivaQuestion.create({
    data: {
      id: faker.datatype.uuid(),
      submissionId: submission.id,
      question: faker.lorem.sentence(),
      status: 'PENDING',
    },
  });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: VivaQuestion
    \rQuestion: ${vivaQuestion.question}
    \r${HR('white', '-', 30)}
  `);
};

async function seed(): Promise<void> {
  await seedUsers();
  await seedUnits();
  await seedTutors();
  await seedStudents();
  await seedAssignments();
  await seedSubmissions();
  //await seedVivaQuestions();
}

async function main(): Promise<void> {
  let isError = false;
  try {
    await seed();
  } catch (e) {
    isError = true;
    logger.error(e);
  } finally {
    await prisma.$disconnect();
    process.exit(isError ? 1 : 0);
  }
}

void main();

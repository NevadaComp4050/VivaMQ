import { type AccessRole, PrismaClient, Role, type Term } from '@prisma/client';
import argon2 from 'argon2';
import logger from '../src/lib/logger'; // Assumes you have logger
import { HR } from '../src/utils/helper'; // Assumes you have HR helper

const prisma = new PrismaClient();

// Function to seed users
const seedUsers = async (): Promise<void> => {
  const password1 = await argon2.hash('password111');
  const password2 = await argon2.hash('password222');
  const password3 = await argon2.hash('password333');

  const usersData = [
    {
      email: 'user1@sample.com',
      name: 'User One',
      password: password1,
      role: Role.ADMIN,
    },
    {
      email: 'user2@sample.com',
      name: 'User Two',
      password: password2,
      role: Role.TEACHER,
    },
    {
      email: 'user3@sample.com',
      name: 'User Three',
      password: password3,
      role: Role.STUDENT,
    },
  ];

  const users = await prisma.user.createMany({ data: usersData });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: user
    \rcount: ${users.count}
    \r${HR('white', '-', 30)}
  `);
};

// Function to seed sessions
const seedSessions = async (): Promise<void> => {
  const sessionsData = [
    {
      displayName: 'Fall 2024',
      year: 2024,
      term: 'SESSION_1' as Term,
    },
    {
      displayName: 'Spring 2025',
      year: 2025,
      term: 'SESSION_2' as Term,
    },
    {
      displayName: 'Summer 2025',
      year: 2025,
      term: 'SESSION_3' as Term,
    },
    {
      displayName: 'All Year 2024-2025',
      year: 2024,
      term: 'ALL_YEAR' as Term,
    },
  ];

  const sessions = await prisma.session.createMany({ data: sessionsData });

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: session
    \rcount: ${sessions.count}
    \r${HR('white', '-', 30)}
  `);
};

// Function to create units and assignments for users
const createUnitsAndAssignments = async (
  userId: string,
  sessionId: string,
  unitNames: string[]
): Promise<void> => {
  for (const unitName of unitNames) {
    await prisma.unit.create({
      data: {
        name: unitName,
        sessionId,
        ownerId: userId,
        assignments: {
          create: [
            {
              name: `Project 1 for ${unitName}`,
              specs: `Design and implement a ${unitName.toLowerCase()} feature.`,
              settings: 'Group Project',
            },
            {
              name: `Lab 1 for ${unitName}`,
              specs: `Complete the ${unitName.toLowerCase()} hands-on exercise.`,
              settings: 'Individual Lab',
            },
            {
              name: `Homework 1 for ${unitName}`,
              specs: `Submit solutions to the ${unitName.toLowerCase()} problem set.`,
              settings: 'Homework',
            },
            {
              name: `Midterm for ${unitName}`,
              specs: `Take the ${unitName.toLowerCase()} midterm exam.`,
              settings: 'Exam',
            },
            {
              name: `Final Project for ${unitName}`,
              specs: `Develop a full project based on ${unitName.toLowerCase()}.`,
              settings: 'Group Project',
            },
          ],
        },
      },
    });
  }
};

const shareUnitsWithUsers = async (
  ownerId: string,
  unitIds: string[],
  userIds: string[],
  accessRole: AccessRole = 'READ_ONLY' // Use AccessRole enum, default to 'READ_ONLY'
): Promise<void> => {
  for (const unitId of unitIds) {
    for (const userId of userIds) {
      // Skip if trying to give access to the owner
      if (userId === ownerId) continue;

      await prisma.unitAccess.create({
        data: {
          unitId,
          userId,
          role: accessRole, // Use a valid AccessRole enum value
        },
      });
    }
  }
};

// Function to seed data into the database
const seed = async (): Promise<void> => {
  await Promise.all([seedUsers(), seedSessions()]);

  const user1 = await prisma.user.findFirst({
    where: { email: 'user1@sample.com' },
  });
  const user2 = await prisma.user.findFirst({
    where: { email: 'user2@sample.com' },
  });
  const user3 = await prisma.user.findFirst({
    where: { email: 'user3@sample.com' },
  });
  const session1 = await prisma.session.findFirst({
    where: { displayName: 'Fall 2024' },
  });
  const session2 = await prisma.session.findFirst({
    where: { displayName: 'Spring 2025' },
  });
  const session3 = await prisma.session.findFirst({
    where: { displayName: 'Summer 2025' },
  });
  const session4 = await prisma.session.findFirst({
    where: { displayName: 'All Year 2024-2025' },
  });

  if (user1 && user2 && user3 && session1 && session2 && session3 && session4) {
    // Create units for user1
    await createUnitsAndAssignments(user1.id, session1.id, [
      'Software Architecture',
      'Distributed Systems',
      'Database Systems',
      'Cloud Computing',
    ]);
    await createUnitsAndAssignments(user1.id, session4.id, [
      'Machine Learning Engineering',
      'DevOps Practices',
    ]);

    // Create units for user2
    await createUnitsAndAssignments(user2.id, session2.id, [
      'Data Structures & Algorithms',
      'Operating Systems',
      'Network Security',
    ]);
    await createUnitsAndAssignments(user2.id, session3.id, [
      'Cybersecurity Essentials',
      'Mobile App Development',
      'Systems Programming',
    ]);

    // Create units for user3
    await createUnitsAndAssignments(user3.id, session1.id, [
      'Frontend Engineering',
      'Backend Engineering',
      'Fullstack Web Development',
    ]);
    await createUnitsAndAssignments(user3.id, session2.id, [
      'Agile Software Development',
      'Software Testing and QA',
    ]);

    // Share units across users
    const user1Units = await prisma.unit.findMany({
      where: { ownerId: user1.id },
    });
    const user2Units = await prisma.unit.findMany({
      where: { ownerId: user2.id },
    });
    const user3Units = await prisma.unit.findMany({
      where: { ownerId: user3.id },
    });

    // User1 shares units with User2 and User3
    await shareUnitsWithUsers(
      user1.id,
      user1Units.map((unit) => unit.id),
      [user2.id, user3.id]
    );

    // User2 shares units with User1 and User3
    await shareUnitsWithUsers(
      user2.id,
      user2Units.map((unit) => unit.id),
      [user1.id, user3.id]
    );

    // User3 shares units with User1 and User2
    await shareUnitsWithUsers(
      user3.id,
      user3Units.map((unit) => unit.id),
      [user1.id, user2.id]
    );
  }
};

// Main function to run seed script
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

// Execute the main function
void main();

import { prisma } from './lib/prisma.js';

try {
  const users = await prisma.user.count();
  const courses = await prisma.course.count();
  const enrollments = await prisma.enrollment.count();
  console.log('OK', { users, courses, enrollments });
} catch (err) {
  console.error('ERR', err);
} finally {
  await prisma.$disconnect();
}

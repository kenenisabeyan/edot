import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: './.env' });

const createTestUsers = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create student
    let student = await prisma.user.findUnique({ where: { email: 'student_test@edot.app' } });
    if (!student) {
      student = await prisma.user.create({
        data: {
          name: 'Test Student',
          email: 'student_test@edot.app',
          password: hashedPassword,
          role: 'student'
        }
      });
      console.log('✅ Created Test Student');
    }

    // Create parent
    let parent = await prisma.user.findUnique({ 
        where: { email: 'parent_test@edot.app' },
        include: { children: true }
    });

    if (!parent) {
      parent = await prisma.user.create({
        data: {
          name: 'Test Parent',
          email: 'parent_test@edot.app',
          password: hashedPassword,
          role: 'parent',
          children: {
            connect: { id: student.id }
          }
        }
      });
      console.log('✅ Created Test Parent and linked to Test Student');
    } else {
        const isLinked = parent.children.some(child => child.id === student.id);
        if(!isLinked){
            await prisma.user.update({
                where: { id: parent.id },
                data: {
                    children: {
                        connect: { id: student.id }
                    }
                }
            });
            console.log('✅ Linked Test Student to Test Parent');
        } else {
            console.log('✅ Parent and Student already linked');
        }
    }

    console.log('Done! You can login with:');
    console.log('Email: parent_test@edot.app');
    console.log('Password: password123');
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

createTestUsers();

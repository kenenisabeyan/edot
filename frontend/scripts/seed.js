const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@edot.com',
      password: 'admin123',
      role: 'admin',
      isApproved: true
    });
    console.log('Admin created:', admin.email);

    // Create tutor
    const tutor = await User.create({
      name: 'John Tutor',
      email: 'tutor@edot.com',
      password: 'tutor123',
      role: 'tutor',
      isApproved: true,
      profile: {
        bio: 'Experienced full-stack developer',
        expertise: ['JavaScript', 'React', 'Node.js'],
        hourlyRate: 50
      }
    });
    console.log('Tutor created:', tutor.email);

    // Create student
    const student = await User.create({
      name: 'Jane Student',
      email: 'student@edot.com',
      password: 'student123',
      role: 'student'
    });
    console.log('Student created:', student.email);

    // Create sample course
    const course = await Course.create({
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack development from scratch',
      tutorId: tutor._id,
      category: 'programming',
      difficultyLevel: 'beginner',
      price: 99.99,
      lessons: [
        {
          title: 'Introduction to Web Development',
          description: 'Overview of web technologies',
          videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          duration: 15,
          order: 1
        },
        {
          title: 'HTML & CSS Fundamentals',
          description: 'Learn the basics of HTML and CSS',
          videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          duration: 25,
          order: 2
        }
      ],
      isPublished: true
    });
    console.log('Course created:', course.title);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin - admin@edot.com / admin123');
    console.log('Tutor - tutor@edot.com / tutor123');
    console.log('Student - student@edot.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

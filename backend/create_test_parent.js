require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create student
    let student = await User.findOne({ email: 'student_test@edot.app' });
    if (!student) {
      student = new User({
        name: 'Test Student',
        email: 'student_test@edot.app',
        password: 'password123',
        role: 'student',
        enrolledCourses: []
      });
      await student.save();
      console.log('✅ Created Test Student');
    }

    // Create parent
    let parent = await User.findOne({ email: 'parent_test@edot.app' });
    if (!parent) {
      parent = new User({
        name: 'Test Parent',
        email: 'parent_test@edot.app',
        password: 'password123',
        role: 'parent',
        children: [student._id]
      });
      await parent.save();
      console.log('✅ Created Test Parent and linked to Test Student');
    } else {
        if(!parent.children.includes(student._id)){
            parent.children.push(student._id);
            await parent.save();
            console.log('✅ Linked Test Student to Test Parent');
        } else {
            console.log('✅ Parent and Student already linked');
        }
    }

    console.log('Done! You can login with:');
    console.log('Email: parent_test@edot.app');
    console.log('Password: password123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

createTestUsers();

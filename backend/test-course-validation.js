const mongoose = require('mongoose');
const Course = require('./models/Course');

async function testCourseValidation() {
    console.log('🛠 Starting Course Model Validation Tests...\n');

    // TEST 1: Valid Course
    console.log('▶ TEST 1: Creating a strictly valid course...');
    const validCourse = new Course({
        title: 'Advanced Fullstack Development',
        description: 'Master MERN stack.',
        instructor: new mongoose.Types.ObjectId(), // Dummy valid ObjectId
        mainCategory: 'Programming & Technology',
        subCategory: 'Web Development',
        duration: 40,
        level: 'Intermediate',
        price: 99
    });

    try {
        await validCourse.validate();
        console.log('✅ Success: Valid course passed validation constraints.\n');
    } catch (err) {
        console.error('❌ Failed: Valid course threw an unexpected error:', err.message, '\n');
    }

    // TEST 2: Invalid Main Category
    console.log('▶ TEST 2: Creating a course with an unregistered mainCategory...');
    const invalidMainCourse = new Course({
        title: 'How to Cook Pasta',
        description: 'Culinary perfection.',
        instructor: new mongoose.Types.ObjectId(),
        mainCategory: 'Culinary Arts', // <-- This does not exist in our categories
        subCategory: 'Cooking',
        duration: 2
    });

    try {
        await invalidMainCourse.validate();
        console.log('❌ Failed: Course incorrectly saved without erroring!\n');
    } catch (err) {
        console.log('✅ Success! Caught expected validation error:');
        console.log('   ↳', err.message, '\n');
    }

    // TEST 3: Invalid Subcategory Mismatch
    console.log('▶ TEST 3: Creating a course with a valid mainCategory but mismatched subCategory...');
    const mismatchedSubCourse = new Course({
        title: 'Quantum Computing Fundamentals',
        description: 'Intro to quantum physics.',
        instructor: new mongoose.Types.ObjectId(),
        mainCategory: 'Programming & Technology', // Valid
        subCategory: 'Earth Science',             // <-- Invalid for this parent!
        duration: 10
    });

    try {
        await mismatchedSubCourse.validate();
        console.log('❌ Failed: Course incorrectly saved without erroring!\n');
    } catch (err) {
        console.log('✅ Success! Caught expected validation error:');
        console.log('   ↳', err.message, '\n');
    }
}

testCourseValidation().then(() => {
    console.log('🏁 All validation analysis complete.');
    process.exit(0);
});

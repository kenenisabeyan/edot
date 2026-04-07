require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course'); // Adjust path as needed

// The mapping dictionary for legacy -> new categories
const CATEGORY_MAPPINGS = {
  'Programming': 'Programming & Technology',
  'Technology': 'Programming & Technology',
  'Code': 'Programming & Technology',
  'Business': 'Business & Entrepreneurship',
  'Marketing': 'Business & Entrepreneurship',
  'Finance': 'Business & Entrepreneurship',
  'Design': 'Personal Development',
  'Personal': 'Personal Development',
  'Health': 'Personal Development',
  'Mathematics': 'Mathematics & Natural Science',
  'Science': 'Mathematics & Natural Science',
  'Physics': 'Mathematics & Natural Science',
  'Social': 'Social Science',
  'History': 'Social Science',
  'General': 'Social Science',
  'Language': 'Natural Language',
  'English': 'Natural Language',
  'Communication': 'Natural Language',
};

// Validate against the new enums from your Course schema
const VALID_CATEGORIES = [
  'Social Science',
  'Mathematics & Natural Science',
  'Natural Language',
  'Programming & Technology',
  'Business & Entrepreneurship',
  'Personal Development'
];

async function runMigration() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edot_test';
  
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully. Commencing migration...');

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses to evaluate...`);

    let updatedCount = 0;
    
    for (const course of courses) {
      if (!VALID_CATEGORIES.includes(course.category)) {
        // Attempt to find a mapping
        const mappedCategory = CATEGORY_MAPPINGS[course.category] || 'Personal Development'; // fallback
        console.log(`[MIGRATION] Mapping legacy category '${course.category}' to '${mappedCategory}' for Course '${course.title}'`);
        
        course.category = mappedCategory;
        await course.save();
        updatedCount++;
      }
    }

    console.log(`\nMigration completed successfully! Updated ${updatedCount} courses.`);
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

runMigration();

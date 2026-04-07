require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

async function deeplyTestFilters() {
    try {
        console.log('✅ Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edot');

        console.log('\n--- 1. SEEDING TEST DATA ---');
        await Course.deleteMany({ title: { $regex: 'TEST_FILTER_' } });

        const rawCourses = [
            {
                title: 'TEST_FILTER_1',
                slug: 'test-filter-1',
                description: 'Learn React',
                instructor: new mongoose.Types.ObjectId(),
                mainCategory: 'Programming & Technology',
                subCategory: 'Web Development',
                duration: 10,
                isPublished: true,
                status: 'approved'
            },
            {
                title: 'TEST_FILTER_2',
                slug: 'test-filter-2',
                description: 'Data Science Intro',
                instructor: new mongoose.Types.ObjectId(),
                mainCategory: 'Programming & Technology',
                subCategory: 'Data Science',
                duration: 20,
                isPublished: true,
                status: 'approved'
            },
            {
                title: 'TEST_FILTER_3',
                slug: 'test-filter-3',
                description: 'Business Analytics Masterclass',
                instructor: new mongoose.Types.ObjectId(),
                mainCategory: 'Business & Entrepreneurship',
                subCategory: 'Business Analytics',
                duration: 15,
                isPublished: true,
                status: 'approved'
            }
        ];
        
        let courses = await Course.insertMany(rawCourses);
        console.log(`Inserted ${courses.length} test courses.`);

        const simulateAPI = async (queryParams) => {
            const { mainCategory, subCategory } = queryParams;
            let query = { isPublished: true, status: 'approved', title: { $regex: 'TEST_FILTER_' } };
            
            if (mainCategory) query.mainCategory = mainCategory;
            if (subCategory) query.subCategory = subCategory;

            return await Course.find(query);
        };

        console.log('\n--- 2. DEEP FILTERING ANALYSIS ---');

        console.log('\n> Filter by: { mainCategory: "Programming & Technology" }');
        const resMain = await simulateAPI({ mainCategory: "Programming & Technology" });
        console.log(`Expected 2 courses, found ${resMain.length}.`);
        resMain.forEach(c => console.log(`  - ${c.title} (${c.mainCategory} > ${c.subCategory})`));

        console.log('\n> Filter by: { subCategory: "Data Science" }');
        const resSub = await simulateAPI({ subCategory: "Data Science" });
        console.log(`Expected 1 course, found ${resSub.length}.`);
        resSub.forEach(c => console.log(`  - ${c.title} (${c.mainCategory} > ${c.subCategory})`));

        console.log('\n> Filter by: { mainCategory: "Business & Entrepreneurship", subCategory: "Business Analytics" }');
        const resCombo = await simulateAPI({ mainCategory: "Business & Entrepreneurship", subCategory: "Business Analytics" });
        console.log(`Expected 1 course, found ${resCombo.length}.`);
        resCombo.forEach(c => console.log(`  - ${c.title} (${c.mainCategory} > ${c.subCategory})`));

        console.log('\n> Filter by: { mainCategory: "Social Science" } (Not matching any test data)');
        const resNone = await simulateAPI({ mainCategory: "Social Science" });
        console.log(`Expected 0 courses, found ${resNone.length}.`);

        console.log('\n--- 3. CLEANING UP ---');
        await Course.deleteMany({ title: { $regex: 'TEST_FILTER_' } });
        console.log('Test data successfully purged.');

    } catch (e) {
        console.error('Test script failed:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Detached DB safely.');
    }
}

deeplyTestFilters();

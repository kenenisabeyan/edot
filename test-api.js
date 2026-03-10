// test-api.js
const axios = require('axios');

const testAPI = async () => {
  try {
    // Test health endpoint
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', health.data);

    // Test courses
    const courses = await axios.get('http://localhost:5000/api/courses');
    console.log('✅ Courses fetched:', courses.data.courses.length);

    // Test login
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'student@edot.com',
      password: 'student123'
    });
    console.log('✅ Login successful:', login.data.email);

    console.log('\n🎉 All tests passed! Application is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAPI();
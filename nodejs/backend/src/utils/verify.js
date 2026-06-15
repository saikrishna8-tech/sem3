import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import app from '../app.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';

dotenv.config();

const PORT = 8089;
let server;

const testRequest = async (path, options = {}) => {
  const url = `http://localhost:${PORT}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  const contentType = response.headers.get('content-type');
  const data =
    contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

  return { status: response.status, data };
};

const runTests = async () => {
  console.log('\n======================================');
  console.log('       AuraBuy Backend Tests         ');
  console.log('======================================\n');

  let testsPassed = 0;
  let testsFailed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      testsPassed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (details) console.error(`       Details: ${JSON.stringify(details, null, 2)}`);
      testsFailed++;
    }
  };

  try {
    await connectDB();

    const dbState = mongoose.connection.readyState;
    if (dbState !== 1) {
      assert(false, 'MongoDB Atlas Connection Check', `State: ${dbState}. Update MONGODB_URI in .env`);
      return;
    }
    assert(true, 'MongoDB Atlas Connection Check');

    const counts = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      categories: await Category.countDocuments(),
      courses: await Course.countDocuments(),
    };
    console.log(`Database Stats: ${JSON.stringify(counts)}`);
    assert(counts.users > 0, 'Database contains seeded Users');
    assert(counts.products > 0, 'Database contains seeded Products');

    const health = await testRequest('/health');
    assert(health.status === 200 && health.data.status === 'ok', 'GET /health returns OK');

    const authTest = await testRequest('/auth/test');
    assert(authTest.status === 200 && authTest.data === 'Auth Working', 'GET /auth/test returns OK');

    const tempEmail = `testuser-${Date.now()}@test.com`;
    const regPayload = { name: 'Testy Tester', email: tempEmail, password: 'password123' };

    const regRes = await testRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(regPayload),
    });
    assert(regRes.status === 200 && regRes.data.email === tempEmail.toLowerCase(), 'POST /auth/register');

    const regDupRes = await testRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(regPayload),
    });
    assert(regDupRes.status === 400, 'POST /auth/register - Block Duplicate Emails');

    const loginRes = await testRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: tempEmail, password: 'password123' }),
    });
    assert(
      loginRes.status === 200 && loginRes.data.token !== undefined && loginRes.data.user !== undefined,
      'POST /auth/login - Login & Receive Token'
    );

    const userToken = loginRes.data.token;

    const profileRes = await testRequest('/auth/profile', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(
      profileRes.status === 200 && profileRes.data.email === tempEmail.toLowerCase(),
      'GET /auth/profile - Fetch Profile via JWT'
    );

    const adminRouteRes = await testRequest('/users', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(adminRouteRes.status === 403, 'Role Authorization - USER blocked from /users');

    const productsRes = await testRequest('/products');
    assert(
      productsRes.status === 200 && Array.isArray(productsRes.data) && productsRes.data.length > 0,
      'GET /products - Fetch all products'
    );

    const searchRes = await testRequest('/search?query=headphones');
    assert(
      searchRes.status === 200 &&
        Array.isArray(searchRes.data.products) &&
        searchRes.data.products.length > 0,
      'GET /search - Search returns matching Products'
    );

    await User.findOneAndDelete({ email: tempEmail.toLowerCase() });
    console.log('Cleaned up test user from database.');
  } catch (error) {
    console.error('Testing crashed with exception:', error);
    testsFailed++;
  } finally {
    console.log('\n======================================');
    console.log(`Summary: ${testsPassed} passed, ${testsFailed} failed`);
    console.log('======================================\n');
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(testsFailed > 0 ? 1 : 0);
    });
  }
};

server = app.listen(PORT, () => {
  console.log(`Temporary testing server started on port ${PORT}`);
  setTimeout(runTests, 1000);
});

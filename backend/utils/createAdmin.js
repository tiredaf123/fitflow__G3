// utils/createAdmin.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'fitflow' });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('fitflow@123@', 10);

    await User.create({
      fullName: 'FitFlow',
      username: 'fitflow',
      email: 'fitflow_G3@gmail.com',
      password: hashedPassword,
      isAdmin: true,
      provider: 'manual',
    });

    console.log('✅ Admin user created: fitflow / fitflow@123@');
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
  }
};

export default createAdminUser;

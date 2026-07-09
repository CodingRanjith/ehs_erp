import dotenv from 'dotenv';
import supabase from '../config/supabase.js';
import { TABLES } from '../modules/auth/auth.model.js';
import { ROLES } from '../utils/constants.js';
import { hashPassword } from '../utils/password.js';
import { throwIfSupabaseError } from '../utils/supabaseMapper.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ehs.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const { data: existingAdmin, error: findError } = await supabase
      .from(TABLES.USERS)
      .select('id, email')
      .eq('email', adminEmail)
      .maybeSingle();

    throwIfSupabaseError(findError, 'Failed to check existing admin');

    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(adminPassword);

    const { error } = await supabase.from(TABLES.USERS).insert({
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: ROLES.ADMIN,
      is_active: true,
    });

    throwIfSupabaseError(error, 'Failed to create admin user');

    console.log('Admin user created successfully');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();

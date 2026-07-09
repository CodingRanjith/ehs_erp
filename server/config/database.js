import supabase from './supabase.js';

const connectDatabase = async () => {
  const { error } = await supabase.from('users').select('id', { count: 'exact', head: true });

  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
      console.warn(
        'Supabase connected, but tables are missing. Run database/schema.sql in the Supabase SQL Editor.'
      );
      return;
    }

    console.error('Supabase connection error:', error.message);
    process.exit(1);
  }

  console.log('Supabase connected successfully');
};

export default connectDatabase;

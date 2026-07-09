import ApiError from './ApiError.js';

const toCamelCase = (key) => key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

export const mapRowToApi = (row) => {
  if (!row) return null;

  const mapped = {
    id: row.id,
    _id: row.id,
  };

  Object.entries(row).forEach(([key, value]) => {
    if (key === 'id') return;
    mapped[toCamelCase(key)] = value;
  });

  return mapped;
};

export const mapRowsToApi = (rows = []) => rows.map(mapRowToApi);

export const mapUserToApi = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    phone: row.phone,
    avatar: row.avatar,
    isActive: row.is_active,
    lastLogin: row.last_login,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const mapApiToDb = (data) => {
  const mapped = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    const snakeKey = key
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');

    mapped[snakeKey] = value;
  });

  return mapped;
};

export const getUserId = (user) => user?.id || user?._id;

export const throwIfSupabaseError = (error, context = 'Database operation failed') => {
  if (!error) return;

  if (error.code === '23505') {
    throw ApiError.conflict('Record already exists');
  }

  if (error.code === 'PGRST116') {
    return;
  }

  throw ApiError.internal(`${context}: ${error.message}`);
};

export const isNotFoundError = (error) => error?.code === 'PGRST116';

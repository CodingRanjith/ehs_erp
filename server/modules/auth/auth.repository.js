import supabase from '../../config/supabase.js';
import { TABLES } from './auth.model.js';
import {
  mapUserToApi,
  mapApiToDb,
  throwIfSupabaseError,
  isNotFoundError,
} from '../../utils/supabaseMapper.js';
import { hashPassword } from '../../utils/password.js';

const USER_PUBLIC_FIELDS = 'id, name, email, role, phone, avatar, is_active, last_login, created_at, updated_at';

class AuthRepository {
  async findByEmail(email, includeSensitive = false) {
    const selectFields = includeSensitive ? '*' : USER_PUBLIC_FIELDS;

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select(selectFields)
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error && !isNotFoundError(error)) {
      throwIfSupabaseError(error, 'Failed to find user by email');
    }

    return data;
  }

  async findById(id, includeSensitive = false) {
    const selectFields = includeSensitive ? '*' : USER_PUBLIC_FIELDS;

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select(selectFields)
      .eq('id', id)
      .maybeSingle();

    if (error && !isNotFoundError(error)) {
      throwIfSupabaseError(error, 'Failed to find user by id');
    }

    return data;
  }

  async findByResetToken(hashedToken) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('reset_password_token', hashedToken)
      .gt('reset_password_expires', new Date().toISOString())
      .maybeSingle();

    if (error && !isNotFoundError(error)) {
      throwIfSupabaseError(error, 'Failed to find user by reset token');
    }

    return data;
  }

  async create(userData) {
    const payload = mapApiToDb(userData);
    payload.email = payload.email?.toLowerCase();

    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert(payload)
      .select(USER_PUBLIC_FIELDS)
      .single();

    throwIfSupabaseError(error, 'Failed to create user');
    return data;
  }

  async updateById(id, updateData) {
    const payload = mapApiToDb(updateData);
    payload.updated_at = new Date().toISOString();

    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(payload)
      .eq('id', id)
      .select(USER_PUBLIC_FIELDS)
      .single();

    throwIfSupabaseError(error, 'Failed to update user');
    return data;
  }

  async updateRefreshToken(id, refreshToken) {
    return this.updateById(id, { refreshToken });
  }

  async clearRefreshToken(id) {
    const { error } = await supabase
      .from(TABLES.USERS)
      .update({ refresh_token: null, updated_at: new Date().toISOString() })
      .eq('id', id);

    throwIfSupabaseError(error, 'Failed to clear refresh token');
    return true;
  }

  async setResetToken(id, hashedToken, expiresAt) {
    const { error } = await supabase
      .from(TABLES.USERS)
      .update({
        reset_password_token: hashedToken,
        reset_password_expires: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    throwIfSupabaseError(error, 'Failed to set reset token');
    return true;
  }

  async clearResetToken(id) {
    const { error } = await supabase
      .from(TABLES.USERS)
      .update({
        reset_password_token: null,
        reset_password_expires: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    throwIfSupabaseError(error, 'Failed to clear reset token');
    return true;
  }

  async updateLastLogin(id) {
    const { error } = await supabase
      .from(TABLES.USERS)
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    throwIfSupabaseError(error, 'Failed to update last login');
    return true;
  }

  toApiUser(row) {
    return mapUserToApi(row);
  }
}

export default new AuthRepository();

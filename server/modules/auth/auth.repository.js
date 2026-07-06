import User from './auth.model.js';

class AuthRepository {
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password +refreshToken +resetPasswordToken +resetPasswordExpires');
    }
    return query.exec();
  }

  async findById(id, includeSensitive = false) {
    const query = User.findById(id);
    if (includeSensitive) {
      query.select('+password +refreshToken +resetPasswordToken +resetPasswordExpires');
    }
    return query.exec();
  }

  async findByResetToken(hashedToken) {
    return User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password +resetPasswordToken +resetPasswordExpires');
  }

  async create(userData) {
    return User.create(userData);
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateRefreshToken(id, refreshToken) {
    return User.findByIdAndUpdate(id, { refreshToken }, { new: true });
  }

  async clearRefreshToken(id) {
    return User.findByIdAndUpdate(id, { refreshToken: null }, { new: true });
  }

  async setResetToken(id, hashedToken, expiresAt) {
    return User.findByIdAndUpdate(
      id,
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiresAt,
      },
      { new: true }
    );
  }

  async clearResetToken(id) {
    return User.findByIdAndUpdate(
      id,
      {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );
  }

  async updateLastLogin(id) {
    return User.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true });
  }
}

export default new AuthRepository();

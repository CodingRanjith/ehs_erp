import env from './env.js';

export const jwtConfig = {
  access: {
    secret: env.jwt.secret,
    expiresIn: env.jwt.expiresIn,
  },
  refresh: {
    secret: env.jwt.refreshSecret,
    expiresIn: env.jwt.refreshExpiresIn,
    rememberExpiresIn: env.jwt.rememberExpiresIn,
  },
};

export default jwtConfig;

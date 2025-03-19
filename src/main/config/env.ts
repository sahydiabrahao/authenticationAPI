export const env = {
  mongoURL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/authenticationAPI',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  salt: process.env.SALT || 12,
};

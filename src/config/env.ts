export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  IS_PROD: process.env.NODE_ENV === 'production',
};

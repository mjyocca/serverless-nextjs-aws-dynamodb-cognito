/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  }
};

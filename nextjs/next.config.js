/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET, // COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
    COGNITO_POOL_ID: process.env.COGNITO_POOL_ID,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    APIGATEWAY: process.env.APIGATEWAY,
    REGION: process.env.REGION,
  },
};

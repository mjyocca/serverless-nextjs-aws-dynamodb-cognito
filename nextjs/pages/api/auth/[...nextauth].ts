import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import type { NextApiRequest, NextApiResponse } from 'next';
import { EnvManager } from '../../../lib/envManager';

EnvManager.set('cognito', (stage) => [
  { env: 'COGNITO_CLIENT_ID', ssm: `/${stage}/cognito/clientId` },
  { env: 'COGNITO_CLIENT_SECRET', ssm: `/${stage}/cognito/clientSecret` },
  { env: 'COGNITO_POOL_ID', ssm: `/${stage}/cognito/poolId` },
]);

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (!EnvManager.has('cognito')) await EnvManager.fetchVars('cognito');
  return await NextAuth(req, res, {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CognitoProvider({
        idToken: true,
        clientId: process.env.COGNITO_CLIENT_ID as string,
        clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
        issuer: `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}`,
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        session.accessToken = token.accessToken;
        return session;
      },
      async jwt({ token, account }) {
        if (account) token.accessToken = account.access_token;
        return token;
      },
    },
  });
}

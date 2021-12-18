import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
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
      async session({ session, token, user }) {
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

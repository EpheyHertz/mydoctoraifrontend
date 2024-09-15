// pages/api/auth/[...nextauth].js

// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';  

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT,
//       clientSecret: process.env.GOOGLE_AUTH_SECRET,
//     }),
//   ],
//   pages: {
//     signIn: '/auth/signin',
//     signOut: '/auth/signout',
//     error: '/auth/error',
//     verifyRequest: '/auth/verify-request',
//     newAccount: '/auth/new-account',
//   },
//   callbacks: {
//     async jwt(token, user) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session(session, token) {
//       session.user.id = token.id;
//       session.user.email = token.email;
//       return session;
//     },
//   },
// });
// app/api/auth/[...nextauth]/route.js

// /pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_AUTH_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (if needed)
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to /update-profile after successful login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/update-profile`;
      }
      return baseUrl;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export async function GET(req, res) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req, res) {
  return NextAuth(req, res, authOptions);
}

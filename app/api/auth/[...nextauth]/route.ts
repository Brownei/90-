import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

// Configure one or more authentication providers
const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0", // Use OAuth 2.0
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after sign in
      if (account) {
        token.accessToken = account.access_token;
        token.twitterId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.user.twitterId = token.twitterId as string;
      return session;
    },
  },
  pages: {
    signIn: "/", // Use the home page as the sign-in page
    signOut: "/", // Use the home page as the sign-out page
    error: "/", // Error code passed in query string as ?error=
  },
});

export { handler as GET, handler as POST }; 
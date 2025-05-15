import { db, users, wallets } from "@/lib/db";
import { eq } from "drizzle-orm";
import NextAuth, { AuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

// Configure one or more authentication providers
export const OPTIONS: AuthOptions = {
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
      if(profile && token.email) {
        const existingUser = await db.select().from(users).where(eq(users.email, token.email!)).leftJoin(wallets, eq(users.id, wallets.userId))

        if (existingUser.length === 0) {
          await db.insert(users).values({
            email: token.email,
            name: token.name,
            emailVerified: true,
            image: token.picture,
          }).returning({id: users.id, email: users.email, profileImage: users.image, name: users.name})
        } 
      }

      if (account) {
        console.log({account})
        token.accessToken = account.access_token;
        token.twitterId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        email: token.email,
        name: token.name,
        image: token.picture,
        twitterId: token.twitterId
      }
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
}
const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST }; 

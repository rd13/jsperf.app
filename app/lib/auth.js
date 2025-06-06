import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuthDBClient } from "@/app/lib/mongodb"; // your mongodb client
export const auth = betterAuth({
  database: mongodbAdapter(betterAuthDBClient.db()),
  socialProviders: { 
    github: { 
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      mapProfileToUser: (profile) => ({ profile })
    }, 
  },
  user: {
    additionalFields: {
      profile: {
        type: "object",
        required: false,
      }
    }
  },
});

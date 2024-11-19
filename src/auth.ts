import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "../prisma/db";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const neon = new Pool({
    connectionString: process.env.DATABASE_URL!
});
const adapter = new PrismaNeon(neon);
const adapter_prisma = new PrismaClient({adapter});

export const {signIn,
    signOut,
    auth,
    handlers,
    unstable_update:update
} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                password:{label:"password", type: "password"},
                email:{label: 'email', type: 'email'}
            },
            async authorize(credentials){
                if(credentials.password!=='123456') return null
               const user = await prisma.user.findFirst({
                where:{
                    email: 'test@mail.com'
                }
               });
               if(!user) return null
                return  user;
            }
        })
    ],
    callbacks: {
        jwt({token, trigger, session}){
            if(trigger==='update') token.name =session?.user?.name
            return token
        }
    },
    adapter: PrismaAdapter(adapter_prisma)
})
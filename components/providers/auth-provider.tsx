"use client"
import { useAuthLogin } from "@/hooks/use-auth-login";
import { useSessionStore } from "@/stores/use-session-store";
import { decryptData } from "@/utils/utils";
import { PublicKey } from "@solana/web3.js";
import { IProvider } from "@web3auth/base";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react"

const AuthProvider = ({ children, token }: { children: React.ReactNode, token: string }) => {
  const router = useRouter()
  const {session} = useSessionStore()
  const {  setUser, user, setLoggedIn, setIsLoading } = useAuthLogin();

  // useEffect(() => {
  //   if(user === null) {
  //     router.push('/')
  //   }
  // }, [user, router])

  useEffect(() => {
     if(session !== null) {
      setIsLoading(true)
      const parsedData = decryptData(session)
      const user = JSON.parse(parsedData) as UserReturns
      // const decryptedProvider = decryptData(user.encryptedProvider)
      // const provider = JSON.parse(decryptedProvider) as IProvider

      setUser({
        name: user.name,
        profileImage: user.profileImage,
        email: user.email,
        address: user.publicKey,
        balance: String(user.balance),
        id: user.id
      })

      setLoggedIn(true)
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }, [session, setUser, router]);

  return (
    <>
      {children}
    </>
  )
}

export default AuthProvider

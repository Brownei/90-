"use client"
import { useAuthLogin } from "@/hooks/use-auth-login";
import { decryptData } from "@/utils/utils";
import { PublicKey } from "@solana/web3.js";
import { IProvider } from "@web3auth/base";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react"

const AuthProvider = ({ children, token }: { children: React.ReactNode, token: string }) => {
  const router = useRouter()
  const {  setUser, user, setLoggedIn, setIsLoading } = useAuthLogin();
  console.log({token})

  useEffect(() => {
    if(user === null) {
      router.push('/')
    }
  })

  // useEffect(() => {
  //   if (user === null || undefined) {
  //     router.push('/')
  //   } else if(token !== undefined) {
  //     setIsLoading(true)
  //     const parsedData = decryptData(token)
  //     const user = JSON.parse(parsedData) as UserReturns
  //     const decryptedProvider = decryptData(user.encryptedProvider)
  //     const provider = JSON.parse(decryptedProvider) as IProvider
  //     console.log({user})
  //
  //     setUser({
  //       name: user.name,
  //       profileImage: user.profileImage,
  //       email: user.email,
  //       address: user.publicKey,
  //       balance: String(user.balance),
  //       provider: provider,
  //       id: user.id
  //     })
  //
  //     setLoggedIn(true)
  //     setIsLoading(false)
  //   } else {
  //     router.push('/')
  //   }
  // }, [token, setUser, router, user]);
  //
  return (
    <>
      {children}
    </>
  )
}

export default AuthProvider

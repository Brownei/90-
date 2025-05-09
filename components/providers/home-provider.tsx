"use client"
import { useAuthLogin } from "@/hooks/use-auth-login";
import { useSessionStore } from "@/stores/use-session-store";
import { decryptData } from "@/utils/utils";
import { PublicKey } from "@solana/web3.js";
import { IProvider } from "@web3auth/base";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react"

interface ProvidersProps {
  children: React.ReactNode;
  token: string
}

const HomeProvider = ({ children, token }: ProvidersProps) => {
    const pathname = usePathname()
  const {session} = useSessionStore()
  const router = useRouter()
  const {  setUser, user, setIsLoading, setLoggedIn } = useAuthLogin();
  // useEffect(() => {
  //   if(pathname !== '/' && user === null) {
  //     router.push('/')
  //   }
  // }, [user, pathname, router])

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
        address: new PublicKey(user.publicKey),
        balance: String(user.balance),
        id: user.id
      })

      setLoggedIn(true)
      setIsLoading(false)
    } else if (pathname !== '/' && session === null) {
      router.push('/')
    }
  }, [session, setUser, router, pathname]);

  return (
    <>
      {children}
    </>
  )
}

export default HomeProvider

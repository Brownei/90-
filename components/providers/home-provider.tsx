"use client"
import { useAuthLogin } from "@/hooks/use-auth-login";
import { useSessionStore } from "@/stores/use-session-store";
import { getSolanaBalance, updateWalletData } from "@/utils/solanaHelpers";
import { decryptData, encryptData } from "@/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react"

interface ProvidersProps {
  children: React.ReactNode;
  token: string
}

const HomeProvider = ({ children, token }: ProvidersProps) => {
    const pathname = usePathname()
  const router = useRouter()
  const {session, setSession} = useSessionStore()
  const {  setUser, user, setLoggedIn, setIsLoading } = useAuthLogin();

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
        address: user.publicKey,
        balance: String(user.balance),
        id: user.id
      })

      setLoggedIn(true)
      setIsLoading(false)
    } else if (pathname !== '/' && session === null) {
      router.push('/')
    }
  }, [session, setUser, router, pathname]);

//     useEffect(() => {
//   if (user !== null) {
//     const lastRunKey = 'last-balance-check';
//     const now = Date.now();
//     const lastRun = Number(localStorage.getItem(lastRunKey));
//
//     const TWO_MINUTES = 2 * 60 * 1000;
//
//     if (!lastRun || now - lastRun > TWO_MINUTES) {
//       const getB = async () => {
//         const userBalance = await getSolanaBalance(user?.address!);
//
//         await updateWalletData(user?.address!);
//
//         setUser(prev => ({
//             ...prev,
//             balance: userBalance.toString()
//         }))
//         const token = encryptData(JSON.stringify(user))
//         setSession(token)
//         localStorage.setItem(lastRunKey, String(now));
//       };
//
//       getB();
//     }
//   }
// }, [user]);

  return (
    <>
      {children}
    </>
  )
}

export default HomeProvider

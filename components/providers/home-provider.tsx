"use client"
import { useAuthLogin } from "@/hooks/use-auth-login";
import { decryptData } from "@/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react"

interface ProvidersProps {
  children: React.ReactNode;
  token: string
}

interface UserReturns {
        id: string, 
        email: string, 
        name: string,
        profileImage: string
}

const HomeProvider = ({ children, token }: ProvidersProps) => {
    const pathname = usePathname()
  const router = useRouter()
  const {  setUser, setIsLoading, setLoggedIn } = useAuthLogin();

  useEffect(() => {
    if(token !== undefined) {
      setIsLoading(true)
      const parsedData = decryptData(token)
      const user = JSON.parse(parsedData) as UserReturns
      console.log(user)

      setUser({
        name: user.name,
        profileImage: user.profileImage,
        email: user.email,
        id: user.id
      })

      setLoggedIn(true)
      setIsLoading(false)
    } else if (pathname !== '/' && token === undefined) {
      router.push('/')
    }
  }, [token, setUser, router, setIsLoading, setLoggedIn, pathname]);

  return (
    <>
      {children}
    </>
  )
}

export default HomeProvider

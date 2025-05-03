"use client"
import { useAuthLogin } from "@/hooks/use-auth-login";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const {
    loggedIn,
    isAuthenticated,
  } = useAuthLogin();


  //  useEffect(() => {
  //   if (!loggedIn && !isAuthenticated) {
  //     router.push("/login"); // ✅ safe inside useEffect
  //   }
  // }, [loggedIn, isAuthenticated]);

  if (!loggedIn && !isAuthenticated) {
    router.push('/')
  }

  return (
    <>
      {children}
    </>
  )
}

export default AuthProvider

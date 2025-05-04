"use client"
import { useAuthLogin } from "@/hooks/use-auth-login";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { loggedIn } = useAuthLogin();


  //  useEffect(() => {
  //   if (!loggedIn && !isAuthenticated) {
  //     router.push("/login"); // ✅ safe inside useEffect
  //   }
  // }, [loggedIn, isAuthenticated]);
  useEffect(() => {
    if (!loggedIn) {
      router.push('/');
    }
  }, [loggedIn, router]);

  return (
    <>
      {children}
    </>
  )
}

export default AuthProvider

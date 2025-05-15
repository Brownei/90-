"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react"

const AuthProvider = ({ children}: { children: React.ReactNode }) => {
  const router = useRouter()
  const {data} = useSession()

  if (data?.user === undefined) {
    router.push('/')
  } else {
    return (
      <>
        {children}
      </>
    )
  }
}

export default AuthProvider

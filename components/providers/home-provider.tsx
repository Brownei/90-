"use client"
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React  from "react"

interface ProvidersProps {
  children: React.ReactNode;
}

const HomeProvider = ({ children}: ProvidersProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const {data} = useSession()

  if (data?.user === undefined) {
    router.push('/')
  } else if(data.user !== undefined && pathname === '/') {
    router.push('/comment-hub')
  } else {
    return (
      <>
        {children}
      </>
    )
  }
}

export default HomeProvider

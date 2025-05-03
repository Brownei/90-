import ClientParticularGamePage from '@/components/comment-hub/ClientParticularGamePage'
import React from 'react'
import { Metadata } from 'next'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Match Commentary & Wagers | 90+',
  description: 'Live match commentary, betting, and interactive chat for sports enthusiasts.',
};

function ParticularGamePage() {
  return (
    <main className='h-screen overflow-hidden pt-[60px]'>
      <ClientParticularGamePage />
    </main>
  )
}

export default ParticularGamePage

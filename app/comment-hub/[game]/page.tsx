import ClientParticularGamePage from '@/components/comment-hub/ClientParticularGamePage'
import React from 'react'
import { Metadata } from 'next'
import { trpc } from '@/trpc/server';
import { reverseFormatString } from '@/utils/utils';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Match Commentary & Wagers | 90+',
  description: 'Live match commentary, betting, and interactive chat for sports enthusiasts.',
};

async function ParticularGamePage({params}: {
  params: Promise<{ game: string }>
}) {
  const {game} = await params
  const selectedGame = await trpc.hubs.getAParticularHub({name: game})
  const [home, away] = reverseFormatString(game).split("Vs")
  const particularGameLiveScores = await trpc.games.getParticularLiveMatches({home: home.trim().toLowerCase(), away: away.trim().toLowerCase()})

  return (
    <main className=' overflow-hidden '>
      <ClientParticularGamePage seletedGame={selectedGame} particularGameLiveScores={particularGameLiveScores}/>
    </main>
  )
}

export default ParticularGamePage

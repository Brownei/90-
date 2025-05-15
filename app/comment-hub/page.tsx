import CommentHubPage from '@/components/comment-hub/CommentHubPage'
import Nav from '@/components/Nav';
import { trpc } from '@/trpc/server';
import { getServerSession } from 'next-auth';
import React from 'react'
import { OPTIONS } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function CommentHub() {
  const fixturedGames = await trpc.games.getAllFixtures()
  const liveGames = await trpc.games.liveMatches()
  // const session = await getServerSession(OPTIONS)
  //
  // if (session === null) {
  //   redirect('/')
  // }

  return (
    <main className='pt-[60px] mb-[500px]'>
      <Nav />
      <CommentHubPage liveGames={liveGames} fixturedGames={fixturedGames}/>
    </main>
  );
}


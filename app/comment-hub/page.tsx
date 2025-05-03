import CommentHubPage from '@/components/comment-hub/CommentHubPage'
import Nav from '@/components/Nav';
import { trpc } from '@/trpc/server';
import React from 'react'

export default async function CommentHub() {
  //const matches = await trpc.matches();
  //console.log(matches)

  return (
    <main className='pt-[60px] mb-[500px]'>
      <Nav />
      <CommentHubPage />
    </main>
  );
}


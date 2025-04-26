import CommentHubPage from '@/components/comment-hub/CommentHubPage'
import { trpc } from '@/trpc/server';
import React from 'react'

export default async function CommentHub() {
  //const matches = await trpc.matches();
  //console.log(matches)

  return (
    <main className='mt-[80px] mb-[500px]'>
      <CommentHubPage />
    </main>
  );
}


import CommentHubPage from '@/components/comment-hub/CommentHubPage'
import Nav from '@/components/Nav';
import React from 'react'

export default async function CommentHub() {
  return (
    <main className='pt-[60px] mb-[500px]'>
      <Nav />
      <CommentHubPage />
    </main>
  );
}


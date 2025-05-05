import CreateNewCommentHubPage from '@/components/comment-hub/CreateNewCommentHubPage'
import React, { Suspense } from 'react'

function CreateCommentHub() {
  return (
    <main className='pt-[60px]'>
      <Suspense>
        <CreateNewCommentHubPage />
      </Suspense>
    </main>
  )
}

export default CreateCommentHub

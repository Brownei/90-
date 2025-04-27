import CreateNewCommentHubPage from '@/components/comment-hub/CreateNewCommentHubPage'
import React, { Suspense } from 'react'

function CreateCommentHub() {
  return (
    <main className='my-[30px]'>
      <Suspense>
        <CreateNewCommentHubPage />
      </Suspense>
    </main>
  )
}

export default CreateCommentHub

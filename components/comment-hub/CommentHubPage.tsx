"use client"
import React from 'react'
import Tabs from './ui/tabs'
import { useTabsStore } from '@/stores/use-tabs-store'
import SearchComponent from './ui/search-component'
import Carousel from '../carousel/carousel'

const tabs = [
  "All",
  "Premier League",
  "La Liga",
  "UCL"
]

const CommentHubPage = () => {
  const { selected, setSelected } = useTabsStore()

  return (
    <main className='mt-[60px] mb-[100px]'>
      <div className='container mx-auto px-3 py-1 h-screen'>
        <SearchComponent />
        <Tabs tabs={tabs} onSelected={setSelected} selected={selected} />


        <div className='mt-[20px]'>
          <h1 className='font-dmSans font-light text-[1.4rem]'>Live Hubs</h1>
          <div className='flex justify-between items-center font-dmSans font-light text-[0.75rem] text-lightAsh'>
            <p>Join any of these conversations</p>
            <p>Most trending 🔥</p>
          </div>

          <Carousel tabs={tabs} />
        </div>

      </div>
    </main>
  )
}

export default CommentHubPage

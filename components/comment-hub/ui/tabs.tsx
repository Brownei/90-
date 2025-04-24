"use client"
import { formatString, reverseFormatString } from '@/utils/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type TabsProps = {
  tabs: string[]
  selected: string
  onSelected: (tab: string) => void
}

const Tabs: React.FC<TabsProps> = ({ tabs, selected, onSelected }) => {
  const router = useRouter()
  const pathname = useSearchParams()
  console.log(pathname.get("tabs"))

  function routerPush(tab: string, url: string) {
    if (tab === 'All') {
      router.push('/comment-hub')
    } else {
      router.push(url)
    }
  }

  return (
    <div className='grid grid-cols-4 grid-flow-row lg:flex gap-4 lg:gap-2'>
      {tabs.map((tab, i) => {
        const url = formatString(tab)
        const decodeUrl = pathname.get("tabs") !== null ? reverseFormatString(pathname.get("tabs") as string) : ''

        return (
          <button className={`${pathname.get("tabs") === null && tab === 'All' ? 'bg-darkGreen' : decodeUrl === tab && pathname.get("tabs") !== null ? 'bg-darkGreen' : 'border-2 border-black/50 bg-transparent'} py-[2px] rounded-xl w-full font-light lg:w-[140px] lg:py-1 font-dmSans text-[12px] lg:text-[0.9rem] cursor-pointer`} key={i} onClick={() => routerPush(tab, `comment-hub/?tabs=${url}`)}>
            {tab}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs

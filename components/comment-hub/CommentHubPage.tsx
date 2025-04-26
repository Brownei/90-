"use client"
import React, { Suspense } from 'react'
import Tabs from './ui/tabs'
import { useTabsStore } from '@/stores/use-tabs-store'
import SearchComponent from './ui/search-component'
import Carousel from '../carousel/carousel'
import { Game, games } from '@/data'
import PlusIcon from '@/public/icons/PlusIcon'
import LoadingIcon from '@/public/icons/LoadingIcon'
import Link from 'next/link'

const tabs = [
  "All",
  "Premier League",
  "La Liga",
  "UCL"
]

const CommentHubPage = () => {
  const { selected, setSelected } = useTabsStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [filteredGames, setFilteredGames] = React.useState<Game[]>(games)

  React.useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      if (query !== "") {
        const gamesFiltered = games.filter((g) =>
          g.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
          g.homeTeam.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredGames(gamesFiltered);
      } else {
        setFilteredGames(games);
      }

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, games]);

  console.log(query)

  return (
    <main>
      <div className='container mx-auto px-3 py-1 h-screen'>
        <SearchComponent setQuery={setQuery} />
        <Suspense>
          <Tabs tabs={tabs} onSelected={setSelected} selected={selected} />
        </Suspense>

        <div className='mt-[20px]'>
          <h1 className='font-dmSans font-light text-[1.4rem]'>Live Hubs</h1>
          <div className='flex justify-between items-center font-dmSans font-light text-[0.75rem] text-lightAsh'>
            <p>Join any of these conversations</p>
            <p>Most trending 🔥</p>
          </div>

          {isLoading ? <LoadingIcon /> : <Carousel tabs={filteredGames} isLive />}
        </div>

        <div className='mt-[20px]'>
          <h1 className='font-dmSans font-light text-[1.4rem]'>Upcoming Hubs</h1>
          {isLoading ? (
            <div className=''>
              <LoadingIcon />
            </div>
          ) : <Carousel tabs={filteredGames} isLive={false} />}
        </div>

        <Link href={'/comment-hub/create-new-hub'} className='fixed bottom-6 right-6 z-40'>
          <PlusIcon />
        </Link>
      </div>
    </main>
  )
}

export default CommentHubPage

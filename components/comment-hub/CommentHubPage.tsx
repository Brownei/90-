"use client"
import React, { Suspense } from 'react'
import Tabs from './ui/tabs'
import { useTabsStore } from '@/stores/use-tabs-store'
import SearchComponent from './ui/search-component'
import Carousel from '../carousel/carousel'
import { Game, games } from '@/data'
import { PlusIcon } from 'lucide-react'
// import PlusIcon from '@/public/icons/PlusIcon'
import LoadingIcon from '@/public/icons/LoadingIcon'
import Link from 'next/link'

const tabs = [
  "All",
  "Premier League",
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


  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3 gap-10 font-ABCDaitype font-bold">
          <h2 className="text-gray-500">Community Huddle</h2>
          <h2 className="">Live Hubs</h2>
        </div>

        <SearchComponent setQuery={setQuery} />

        <div className="mt-3 flex justify-center">
          <Suspense>
            <Tabs tabs={tabs} onSelected={setSelected} selected={selected} />
          </Suspense>
        </div>

        <div className="mt-5">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-ABCDaitype text-base">Live Hubs</h3>
            <div className="flex items-center text-xs text-gray-500 font-ABCDaitype">
              <span>Most trending</span>
              <span className="text-orange-500 ml-1">🔥</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <LoadingIcon />
              </div>
            ) : (
              <Carousel tabs={filteredGames} isLive />
            )}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="font-ABCDaitype text-base mb-1">Upcoming Hubs</h3>
          <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <LoadingIcon />
              </div>
            ) : (
              <Carousel tabs={filteredGames} isLive={false} />
            )}
          </div>
        </div>

        <Link href="/comment-hub/create-new-hub" className="fixed bottom-6 right-6 z-40 bg-green-700 hover:bg-green-800 rounded-full shadow-lg p-5 transition-colors">
          <PlusIcon fontSize={64} size={32} color='#fff' />
        </Link>
      </div>
    </main>
  )
}

export default CommentHubPage

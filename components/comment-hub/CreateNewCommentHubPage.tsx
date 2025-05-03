"use client"
import React, { useState } from 'react'
import SearchComponent from './ui/search-component'
import MessageIcon from '@/public/icons/MessageIcon'
import { Game, games } from '@/data'
import LoadingIcon from '@/public/icons/LoadingIcon'
import Card from './ui/card'
import ArrowRightIcon from '@/public/icons/ArrowRightIcon'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatString, reverseFormatString } from '@/utils/utils'
import { ChevronLeft } from 'lucide-react'

const CreateNewCommentHubPage = () => {
  const router = useRouter()
  const [selectedMatchesToCreated, setSelectedMatchesToCreated] = React.useState<Game | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchedGames, setSearchedGames] = useState<Game[]>([])
  const [query, setQuery] = React.useState("")
  const pathname = useSearchParams()
  const [homeTeam, awayTeam] = pathname.get("new-game") !== null ? reverseFormatString(pathname.get("new-game") as string).split("Vs") : ""
  const seletedGame = games.find((g) => g.awayTeam === awayTeam?.trim() && g.homeTeam === homeTeam?.trim())

  React.useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      if (query !== "") {
        const gamesFiltered = games.filter((g) =>
          g.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
          g.homeTeam.toLowerCase().includes(query.toLowerCase())
        );
        setSearchedGames(gamesFiltered);
      } else {
        setSearchedGames([]);
      }

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, games]);

  React.useEffect(() => {
    if (seletedGame !== undefined) {
      setSearchedGames([]);
    }
  }, [])

  return (
    <main>
      <div className='container mx-auto px-3 py-1 h-screen'>
        <div className='relative items-center'>
          <button onClick={() => router.back()} className='px-3 cursor-pointer absolute top-0 bottom-0'>
            <ChevronLeft color='black' fontSize={10} size={10} className='bg-[#D9D9D9] rounded-full size-[27px] lg:size-[31px] flex items-center justify-center' />
          </button>
          <h1 className='font-specialGothic font-extrabold text-[1.1rem] text-center mb-[20px] uppercase'>Create live hub</h1>
        </div>

        {seletedGame !== undefined ? (
          <Card game={seletedGame} />
        ) : (
          <div>
            <SearchComponent setQuery={setQuery} />
            {isLoading ? <LoadingIcon /> : (
              <div className='mt-[30px]'>
                {searchedGames.length > 0 ? (
                  <div className='grid'>
                    {searchedGames.map((sg, i) => {
                      const urlRoute = formatString(`${sg.homeTeam} vs ${sg.awayTeam}`)

                      return (
                        <button key={i} onClick={() => router.push(`/comment-hub/create-new-hub/?new-game=${urlRoute}`)} className='font-dmSans text-start text-[1rem] cursor-pointer leading-[140%] border-b border-black/24 px-3 py-3 lg:py-6 hover:bg-black/24'>{sg.homeTeam} vs {sg.awayTeam} - 20:00 (Premier League)</button>
                      )
                    })}
                  </div>
                ) : (
                  <div className='flex flex-col justify-center items-center mt-[50px]'>
                    <MessageIcon isInBackground={true} />
                    <p className='text-black/24 font-dmSans w-[200px] lg:w-[400px] text-[0.9rem] text-center'>Start the Conversation for any live or upcoming Match.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main >
  )
}

export default CreateNewCommentHubPage

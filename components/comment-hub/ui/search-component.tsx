"use client"
import SearchIcon from '@/public/icons/SearchIcon'
import React from 'react'

const SearchComponent = ({ setQuery }: { setQuery: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <div className='border-2 border-black/50 rounded-xl flex gap-3 items-center mb-4 py-2 px-3'>
      <SearchIcon />
      <input className='outline-none text-[#BEBEBE] text-[0.9rem] font-dmSans' placeholder='Search.....' onChange={(e) => setQuery(e.target.value)} />
    </div>
  )
}

export default SearchComponent

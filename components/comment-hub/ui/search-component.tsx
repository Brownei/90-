import SearchIcon from '@/public/icons/SearchIcon'
import React from 'react'

const SearchComponent = () => {
  return (
    <div className='border-2 border-black/50 rounded-xl flex items-center mb-4 py-1 px-3'>
      <SearchIcon />
      <input className='outline-none' />
    </div>
  )
}

export default SearchComponent

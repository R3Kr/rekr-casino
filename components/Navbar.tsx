import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <nav className='flex flex-col md:flex-row gap-2 p-2'>
        <Link className='p-2 bg-red-500' href='/leaderboard'>Leaderboard</Link>
        <div className='p-2 bg-red-500'>test2</div>
        <div className='p-2 bg-red-500'>test3</div>
        <div className='p-2 bg-red-500'>test4</div>
        <div className='p-2 bg-red-500'>test5</div>

    </nav>
  )
}

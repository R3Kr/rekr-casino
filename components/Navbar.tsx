import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <nav className='flex flex-col md:flex-row gap-2 p-2 pr-4'>
        <Link className='p-2 bg-purple-500' href='/'>REKr Casino</Link>
        <Link className='p-2 bg-red-500' href='/leaderboard'>Leaderboard</Link>
        <Link className='p-2 bg-red-500' href='/slots'>Slots</Link>
        <div className='p-2 flex-grow'></div>
        <div className='p-2 bg-red-500'>Login</div>
        <div className='p-2 bg-red-500'>Signup</div>

    </nav>
  )
}

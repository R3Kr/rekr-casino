"use client"
import React from 'react'
import { unpoke } from '@/lib/actions'

export default function Unpoke() {
  return (
    <button className='bg-blue-500' onClick={() => unpoke()}>Click here to unpoke yourself</button>
  )
}

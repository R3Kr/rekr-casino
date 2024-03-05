'use client'
 
import { useFormStatus } from 'react-dom'
 
export function PokeButton() {
  const { pending } = useFormStatus()
 
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? "poking...": "Poke"}
    </button>
  )
}
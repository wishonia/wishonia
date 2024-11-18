'use client'

import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function SignPetitionButton() {
  const { data: session } = useSession()

  const handleClick = async () => {
    if (!session) {
      signIn()
      return
    }
    // TODO: Implement petition signing
    console.log('Signing petition...')
  }

  return (
    <Button 
      onClick={handleClick}
      className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 text-xl
                border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none 
                transition-all duration-200"
    >
      {session ? 'Sign the Petition' : 'Sign in to Sign Petition'}
    </Button>
  )
} 
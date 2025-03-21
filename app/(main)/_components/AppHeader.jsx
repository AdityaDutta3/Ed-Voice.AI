import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'

function AppHeader() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center bg-red-50'>
        <Image src={'/logo.svg'} alt="Logo" width ={50} height={50}/>
        <div className='text-2xl font-serif'>ED-VOICE.AI</div>
        <UserButton></UserButton>
    </div>
  )
}

export default AppHeader
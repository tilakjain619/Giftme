import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='px-4 py-3 mt-10 grid items-center justify-center text-center'>
        <ul className='flex items-center gap-3'>
            <li><Link href="#" className='text-zinc-700'>About</Link></li>
            <li><Link href="#" className='text-zinc-700'>Privacy</Link></li>
            <li><Link href="#" className='text-zinc-700'>Terms</Link></li>
        </ul>
        <div className='mt-1'>
            <h2 className='text-zinc-800 font-semibold'>&copy; Giftme {new Date().getFullYear()}</h2>
        </div>
    </footer>
  )
}

export default Footer

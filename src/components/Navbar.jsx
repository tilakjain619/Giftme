import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='px-3 py-2 sm:px-5 sm:py-3 flex justify-between items-center'>
        <img className='w-28' src="./giftme_logo.svg" alt="Giftme Logo" />
        <ul className='flex items-center gap-1'>
            <li><Link className='hover:bg-gray-200 transition-all duration-100 rounded-full px-3 py-1' href="#">Login</Link></li>
            <li className='bg-[#ed5a6b] text-white transition-all duration-100 rounded-full px-3 py-1'><Link href="#">Sign up</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar

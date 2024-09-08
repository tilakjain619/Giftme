'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="px-3 py-2 sm:px-5 sm:py-3 flex justify-between items-center">
      <Link href={isLoggedIn ? "/dashboard" : "/"}><img className="w-28" src="https://res.cloudinary.com/da3wjnlzg/image/upload/v1725446894/Giftme/afpwdihatllvpcw3smim.svg" alt="Giftme Logo" /></Link>
      <ul className="flex items-center gap-1">
        {isLoggedIn ? (
          <>
            {/* <li className="hover:bg-gray-200 transition-all duration-100 rounded-full px-4 py-1.5">
              <Link href="/profile">Profile</Link>
            </li> */}
            <li
              onClick={handleLogout}
              className="bg-[#ed5a6b] hover:bg-[#f68e7e] text-white transition-all duration-100 rounded-full px-4 py-1.5 cursor-pointer"
            >
              Logout
            </li>
          </>
        ) : (
          <>
            <li className="hover:bg-gray-200 cursor-pointer transition-all duration-100 rounded-full px-4 py-1.5">
              <Link href="/login">Login</Link>
            </li>
            <li className="bg-[#ed5a6b] cursor-pointer hover:bg-[#f68e7e] text-white transition-all duration-100 rounded-full px-4 py-1.5">
              <Link href="/signup">Sign up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

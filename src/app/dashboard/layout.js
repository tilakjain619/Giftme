import { UserProvider } from '@/context/UserContext';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Dashboard | Giftme',
  description: 'Manage your profile, view stats, withdraw received gift money, and more with Giftme Dashboard',
};

export default function Layout({ children }) {
  return (
    <UserProvider> {/* Wrap with UserProvider */}
    {children}
    </UserProvider>
  );
}

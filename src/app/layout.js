import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Earn Gifts with Giftme',
  description: 'Create your profile on Giftme and share with your audience to receive gifts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <Navbar />
          <main className="md:max-w-[80%] lg:max-w-[65%] mx-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

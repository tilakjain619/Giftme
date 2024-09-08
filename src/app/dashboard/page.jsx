'use client';
import { useUser } from '@/context/UserContext';
import Loader from '@/components/Loader';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import WithdrawForm from '@/components/WithdrawForm';

const Dashboard = () => {
  const { user, loading } = useUser();
  const [recentGifts, setRecentGifts] = useState([]);
  const [totalGifts, setTotalGifts] = useState(0);
  const [withdrawRequested, setWithdrawRequested] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);


  // Hook to fetch recent gifts
  useEffect(() => {
    if (user) {
      const fetchRecentGifts = async () => {
        try {
          const response = await axios.get(`/api/gifts/recent/${user._id}`);
          setRecentGifts(response.data.gifts);
          setTotalGifts(response.data.totalGifts);
        } catch (error) {
          setError('Failed to load recent gifts.');
        }
      };

      fetchRecentGifts();
    }
  }, [user]);

  // Hook to check withdrawal status
  useEffect(() => {
    const checkWithdrawalStatus = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/withdraw-request/status?email=${user.email}`);
          if (response.data.exists) {
            setWithdrawRequested(true);
          }
        } catch (error) {
          console.error('Failed to check withdrawal status:', error);
        }
      }
    };

    checkWithdrawalStatus();
  }, [user]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.fullName} on Giftme`,
          text: 'Gift creators for their best work with Giftme',
          url: `http://localhost:3000/me/${user.username}`,
        });
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      console.log('Web Share API not supported in this browser');
    }
  };

  // Handle withdraw request
  const handleWithdrawRequest = () => {
    setShowWithdrawForm(true);
  };

  const closeWithdrawForm = () => {
    setShowWithdrawForm(false);
  };

  // Ensure hooks are declared first before any early return
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className='text-lg py-3 px-4'>{error}</div>;
  }

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(`https://localhost:3000/me/${user.username}`)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="relative grid gap-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className='absolute flex gap-3 text-zinc-700 px-2 py-1.5 rounded-lg top-6 bg-zinc-200 right-6'>
        {
          isCopied ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill={"none"}>
          <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg> : <svg title="Copy your profile's Link" className='cursor-pointer' onClick={handleCopyClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill={"none"}>
          <path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        }

        <svg title="Share your profile" className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" onClick={handleShare} viewBox="0 0 24 24" width={20} height={20} fill={"none"}>
          <path d="M20.3927 8.03168L18.6457 6.51461C17.3871 5.42153 16.8937 4.83352 16.2121 5.04139C15.3622 5.30059 15.642 6.93609 15.642 7.48824C14.3206 7.48824 12.9468 7.38661 11.6443 7.59836C7.34453 8.29742 6 11.3566 6 14.6525C7.21697 13.9065 8.43274 13.0746 9.8954 12.7289C11.7212 12.2973 13.7603 12.5032 15.642 12.5032C15.642 13.0554 15.3622 14.6909 16.2121 14.9501C16.9844 15.1856 17.3871 14.5699 18.6457 13.4769L20.3927 11.9598C21.4642 11.0293 22 10.564 22 9.99574C22 9.4275 21.4642 8.96223 20.3927 8.03168Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5676 3C6.70735 3.00694 4.68594 3.10152 3.39411 4.39073C2 5.78202 2 8.02125 2 12.4997C2 16.9782 2 19.2174 3.3941 20.6087C4.78821 22 7.03198 22 11.5195 22C16.0071 22 18.2509 22 19.645 20.6087C20.6156 19.64 20.9104 18.2603 21 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Wallet Summary */}
      <div className="flex  flex-wrap justify-between items-center gap-2 bg-[#ed5a6b] text-white shadow-lg shadow-zinc-200 rounded-lg p-4">
        <div>
          <h2 className="text-xl font-semibold">Wallet</h2>
          <p className="text-lg">Balance: ₹{user.walletAmount}</p>
        </div>
        <div>
          <button onClick={handleWithdrawRequest} disabled={withdrawRequested} className='flex items-center bg-white hover:bg-opacity-70 disabled:bg-opacity-70 text-zinc-700 px-4 py-3 rounded-lg gap-1'>
            {withdrawRequested ? "Withdrawal Requested" : "Request Withdrawal"}
          </button>
        </div>
        {showWithdrawForm && <div className='fixed inset-0 flex items-center justify-center z-20'>
          <div className='relative w-[90%] min-h-[90vh] max-w-[600px] grid items-center'>
            <WithdrawForm onClose={closeWithdrawForm} />
          </div>
          <div className='bg-black bg-opacity-50 fixed inset-0 -z-10'></div>
        </div>}
      </div>

      {/* Gift Summary */}
      <div className="gift-summary bg-[#f68e7e] text-white shadow-lg shadow-zinc-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold">Total Gifts</h2>
        <p className="text-lg">Total Gifts Received: {totalGifts}</p>
      </div>

      {/* Recent Gifts */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-700">Recent Gifts</h2>
        <ul className='grid sm:grid-cols-2 gap-3 mt-5'>
          {recentGifts.length > 0 ? (
            recentGifts.map((gift) => (
              <li key={gift._id} className=" bg-[#fcbd8d] px-4 py-3 rounded-lg">
                <h2 className='flex items-center gap-1'><span className='font-semibold text-zinc-800'>{gift.senderName ? gift.senderName : "Someone"}</span> <span className='text-sm text-zinc-800'>gifted <span>₹{gift.amount}</span></span></h2>
                {gift.message && <p className='text-sm mt-1 text-zinc-700'>{gift.message}</p>}
                {gift.senderEmail && <p className='text-sm mt-1 text-zinc-700'>Say thanks: <Link href={`mailto:${gift.senderEmail}`}>{gift.senderEmail}</Link></p>}
              </li>
            ))
          ) : (
            <li>No gifts received yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

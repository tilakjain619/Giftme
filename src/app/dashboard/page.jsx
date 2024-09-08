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

  return (
    <div className="dashboard-container grid gap-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

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
  </div> }
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

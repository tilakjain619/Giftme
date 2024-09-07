'use client'
import { useUser } from '@/context/UserContext';
import Loader from '@/components/Loader';
import axios from 'axios';


import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { user, loading } = useUser();  
  const [recentGifts, setRecentGifts] = useState([]);
  const [totalGifts, setTotalGifts] = useState(0);
  const [error, setError] = useState('');
  

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className='text-lg py-3 px-4'>{error}</div>;
  }

  const handleWithdrawRequest = () =>{
   console.log("Withdraw Button clicked");
   
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
          <button onClick={handleWithdrawRequest} className='flex items-center bg-white hover:bg-opacity-70 text-zinc-700 px-4 py-3 rounded-lg gap-1'>
            Request Withdrawal
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} fill={"none"}>
    <path d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 22H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg>
          </button>
        </div>
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
                {gift.senderEmail && <p className='text-sm mt-1 text-zinc-700'>Email: {gift.senderEmail}</p>}
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

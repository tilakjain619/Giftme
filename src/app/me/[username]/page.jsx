'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import Loader from '@/components/Loader';
import Link from 'next/link';
import './user.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function ProfilePage({ params }) {
  const { username } = params;
  const [profile, setProfile] = useState(null);
  const [amount, setAmount] = useState(100);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [recentGifts, setRecentGifts] = useState([]);
  const [showUpiId, setShowUpiId] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fetch profile data based on username
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile`, {
          params: { username }
        });
        setProfile(response.data);
      } catch (error) {
        setError('Profile not found!');
      }
    };

    fetchProfile();
  }, [username]);

  const fetchPublicGifts = async (userId) => {
    try {
      const response = await axios.get(`/api/gifts/${userId}`);
      const data = response.data;
      if (data.success) {
        return data.gifts;

      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching public gifts:', error);
      return [];
    }
  };

  useEffect(() => {
    if (profile?._id) {
      const getGifts = async () => {
        const fetchedGifts = await fetchPublicGifts(profile._id);
        setRecentGifts(fetchedGifts);
      };

      getGifts();

    }
  }, [profile?._id]);
  const handleAmountChange = (amt) => {
    setAmount(Number(amt));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.fullName} on Giftme`,
          text: 'Gift creators for their best work with Giftme',
          url: `http://localhost:3000/me/${profile.username}`,
        });
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      console.log('Web Share API not supported in this browser');
    }
  };

  // Create a payment intent when the user clicks on the "Gift" button
  const createPaymentIntent = async () => {
    try {
      const response = await axios.post('/api/create-gift', {
        amount: Number(amount),
        userId: profile._id,
        senderName,
        senderEmail,
        message,
        isPrivate,
      });
      setClientSecret(response.data.clientSecret);
      setPaymentReady(true);
    } catch (error) {
      setError('Failed to initialize payment');
    }
  };

  // Save gift to DB after payment success
  const saveGiftToDB = async (paymentIntent) => {
    try {
      const response = await axios.post('/api/save-gift', {
        amount: Number(amount),
        userId: profile._id,
        senderName,
        senderEmail,
        message,
        isPrivate,
        paymentStatus: paymentIntent.status, // Save the status of the payment
        stripePaymentId: paymentIntent.id,   // Save the Stripe payment ID
      });
      console.log('Gift saved to DB:', response.data);
      setAmount(100);
      setMessage("");
      setSenderEmail("");
      setSenderName("");
      setIsPrivate(false);
      setPaymentReady(false);
    } catch (error) {
      console.error('Failed to save gift to DB:', error);
      setError('Failed to save gift after successful payment.');
    }
  };

  if (error) {
    return <div className='text-lg py-3 px-4 grid items-center justify-center min-h-[80vh]'>{error}</div>;
  }

  if (!profile) {
    return <Loader />;
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
    copyTextToClipboard(profile.upiId)
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
    <div className={`flex flex-col max-w-[600px] lg:max-w-full lg:flex-row mx-auto items-center lg:items-start justify-center min-h-[90vh]`}>
      <div className='grid px-3 relative py-2 gap-4 text-center'>
        <h1 className='text-lg font-bold lg:text-2xl'>{profile.fullName}</h1>
        <div title="Share this profile" className='absolute text-zinc-600 top-3 right-8'>
          <svg className='cursor-pointer' onClick={handleShare} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill={"none"}>
            <path d="M18 7C18.7745 7.16058 19.3588 7.42859 19.8284 7.87589C21 8.99181 21 10.7879 21 14.38C21 17.9721 21 19.7681 19.8284 20.8841C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8841C3 19.7681 3 17.9721 3 14.38C3 10.7879 3 8.99181 4.17157 7.87589C4.64118 7.42859 5.2255 7.16058 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12.0253 2.00052L12 14M12.0253 2.00052C11.8627 1.99379 11.6991 2.05191 11.5533 2.17492C10.6469 2.94006 9 4.92886 9 4.92886M12.0253 2.00052C12.1711 2.00657 12.3162 2.06476 12.4468 2.17508C13.3531 2.94037 15 4.92886 15 4.92886" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className='grid w-full mb-10 gap-2 bg-white user-bg-shadow rounded-3xl px-5 py-6'>
          <div>
            <ul className='flex items-center border bg-zinc-100 rounded-2xl py-2 px-3 border-zinc-200 gap-1 justify-center'>
              <li onClick={() => handleAmountChange(100)} className={`text-xs font-semibold text-[#ed5a6b] border cursor-pointer w-10 h-10 grid items-center bg-white px-3 rounded-full justify-center ${amount === 100 ? 'border-[#ed5a6b]' : 'border-zinc-200'}`}>100</li>
              <li onClick={() => handleAmountChange(500)} className={`text-xs font-semibold text-[#ed5a6b] border cursor-pointer w-10 h-10 grid items-center bg-white px-3 rounded-full justify-center ${amount === 500 ? 'border-[#ed5a6b]' : 'border-zinc-200'}`}>500</li>
              <li onClick={() => handleAmountChange(1000)} className={`text-xs font-semibold text-[#ed5a6b] border cursor-pointer w-10 h-10 grid items-center bg-white px-3 rounded-full justify-center ${amount === 1000 ? 'border-[#ed5a6b]' : 'border-zinc-200'}`}>1000</li>
              <li><input min={100} max={10000} className='w-10 invalid:border-red-400 text-xs px-2 h-10 rounded-md border border-zinc-200 outline-none bg-white' type="number" onChange={(e) => handleAmountChange(e.target.value)} placeholder='Custom' /></li>
            </ul>
          </div>
          <input
            className='bg-zinc-100 w-full sm:min-w-72 px-3 py-3 outline-none rounded-2xl'
            type="text"
            required
            placeholder='Name or @yoursocial'
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
          <input
            className='bg-zinc-100 w-full sm:min-w-72 px-3 py-3 outline-none rounded-2xl'
            type="email"
            required
            placeholder='Your email'
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
          />
          <textarea
            className='bg-zinc-100 w-full sm:min-w-72 h-28 resize-none px-3 py-3 outline-none rounded-2xl'
            placeholder='Say something nice...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label className='flex items-center mb-2'>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <span className='ml-2'>Keep this gift private</span>
          </label>

          {!paymentReady && (
            <>
              <button
                onClick={createPaymentIntent}
                className="bg-[#ed5a6b] w-full hover:bg-[#f68e7e] text-white font-semibold py-3 px-8 rounded-full"
              >
                Gift ₹{amount}
              </button>
              <p className='text-center flex flex-col sm:flex-row items-center justify-center text-sm text-zinc-700'><span className='cursor-pointer' onClick={() => setShowUpiId(!showUpiId)}>Or send gift via UPI</span>{showUpiId && <span className='flex items-center gap-1'>, use this <span className='font-semibold flex items-center gap-1' onClick={() => handleCopyClick(profile.upiId)}>{profile.upiId}{isCopied ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={14} height={14} fill={"none"}>
    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg> : <svg xlinkTitle='Copy UPI' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={14} height={14} fill={"none"}>
                <path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>}</span></span>}</p>
            </>
          )}

          {paymentReady && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={amount}
                clientSecret={clientSecret}
                saveGiftToDB={saveGiftToDB}
              />
            </Elements>
          )}
        </div>

        {profile.bio && (
          <div className='text-left bg-zinc-300 px-5 py-4 rounded-2xl'>
            <h3 className='font-semibold'>About {profile.fullName}</h3>
            <p className='text-gray-800 mt-1'>{profile.bio}</p>
          </div>
        )}

        {profile.socialLinks.length > 1 && (
          <ul className='flex gap-2 justify-center mt-2 text-zinc-700 text-sm items-center'>
            {profile.socialLinks.map((link) => {
              const fullUrl = link.url.startsWith('http://') || link.url.startsWith('https://')
                ? link.url
                : `https://${link.url}`;
              return (
                <li key={link._id}>
                  <Link href={fullUrl} target="_blank" rel="noopener noreferrer">
                    {link.platform}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className='grid gap-2 px-3 py-2'>
        <h2 className='text-center text-lg md:text-2xl font-bold text-zinc-700 my-3 md:my-5 lg:my-0 lg:mb-3 lg:text-lg'>Recent supporters 💖</h2>
        {/* Render gifts or any other component logic */}
        {recentGifts.length > 0 ? (
          recentGifts.map(gift =>
            <div key={gift._id} className='bg-[#ed5a6b] px-5 py-4 rounded-2xl text-white'>
              <h2 className='flex items-center gap-1'><span className='font-semibold'>{gift.senderName ? gift.senderName : "Someone"}</span> <span className='text-sm text-[#ffecd1]'>gifted <span>₹{gift.amount}</span></span></h2>
              {gift.message && <p className='text-sm mt-1 text-[#f2f2f2]'>{gift.message}</p>}
            </div>)
        ) : (
          <p className='px-2 py-3 text-center'>Be the first to Gift <span className='animate-pulse'>🩵</span></p>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({ amount, clientSecret, saveGiftToDB }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setPaymentError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      setPaymentSuccess(true);
      setPaymentError(null);
      await saveGiftToDB(paymentIntent); // Save gift after successful payment
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className='mt-4 w-full sm:min-w-72 rounded-2xl bg-blue-500 text-white py-2'
      >
        Pay ₹{amount}
      </button>
      {paymentError && <div className="text-red-600 mt-2">{paymentError}</div>}
      {paymentSuccess && <div className="text-green-600 mt-2">Your gift was received ❤️</div>}
    </form>
  );
}

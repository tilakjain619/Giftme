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

  const handleAmountChange = (amt) => {
    setAmount(amt);
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

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post('/api/create-gift', {
        amount,
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

  if (error) {
    return <div className='text-2xl py-3 px-2'>{error}</div>;
  }

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className={`grid items-center justify-center min-h-[90vh]`}>
      <div className='grid px-3 py-2 max-w-[600px] gap-2 text-center'>
        <h1 className='text-lg font-bold'>{profile.fullName}</h1>
        <div className='absolute text-zinc-600 right-10'>
          <svg title="Share this profile" className='cursor-pointer' onClick={handleShare} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill={"none"}>
            <path d="M18 7C18.7745 7.16058 19.3588 7.42859 19.8284 7.87589C21 8.99181 21 10.7879 21 14.38C21 17.9721 21 19.7681 19.8284 20.8841C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8841C3 19.7681 3 17.9721 3 14.38C3 10.7879 3 8.99181 4.17157 7.87589C4.64118 7.42859 5.2255 7.16058 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12.0253 2.00052L12 14M12.0253 2.00052C11.8627 1.99379 11.6991 2.05191 11.5533 2.17492C10.6469 2.94006 9 4.92886 9 4.92886M12.0253 2.00052C12.1711 2.00657 12.3162 2.06476 12.4468 2.17508C13.3531 2.94037 15 4.92886 15 4.92886" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className='grid w-full mb-10 gap-2 bg-white user-bg-shadow rounded-lg px-5 py-6'>
          <div>
            <ul className='flex items-center border bg-zinc-100 rounded-2xl py-2 px-3 border-zinc-200 gap-1 justify-center'>
              <li onClick={() => handleAmountChange(100)} className='text-xs font-semibold text-[#ed5a6b] border border-zinc-200 cursor-pointer w-10 h-10 grid items-center bg-white px-3 rounded-full justify-center'>100</li>
              <li onClick={() => handleAmountChange(500)} className='text-xs font-semibold text-[#ed5a6b] border border-zinc-200 cursor-pointer w-10 h-10 grid items-center bg-white px-3 rounded-full justify-center'>500</li>
              <li onClick={() => handleAmountChange(1000)} className='text-xs font-semibold text-[#ed5a6b] border border-zinc-200 cursor-pointer w-10 h-10 grid items-center bg-white px-3 rounded-full justify-center'>1000</li>
              <li><input min={100} max={10000} className='w-10 invalid:border-red-400 text-xs px-2 h-10 rounded-md border border-zinc-200 outline-none bg-white' type="number" onChange={(e) => handleAmountChange(e.target.value)} placeholder='Custom' /></li>
            </ul>
          </div>
          <input
            className='bg-zinc-100 w-full sm:min-w-72 px-3 py-3 outline-none rounded-2xl'
            type="text"
            placeholder='Name or @yoursocial'
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
          <input
            className='bg-zinc-100 w-full sm:min-w-72 px-3 py-3 outline-none rounded-2xl'
            type="email"
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

          {
            !paymentReady && <button
            onClick={createPaymentIntent}
            className="bg-[#ed5a6b] w-full hover:bg-[#f68e7e] text-white font-semibold py-3 px-8 rounded-full"
          >
            Gift ₹{amount}
          </button>
          }

          {paymentReady && (
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={amount} clientSecret={clientSecret} />
            </Elements>
          )}
        </div>
        {
          profile.bio && <div className='text-left bg-[#eeeeeeeb] px-5 py-4 rounded-md'>
            <h3 className='font-semibold'>About {profile.fullName}</h3>
            <p className='text-gray-800 mt-1'>{profile.bio}</p></div>
        }
        {
          profile.socialLinks.length > 1 &&
          <ul className='flex gap-2 justify-center items-center'>
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
              )
            })}
          </ul>
        }
      </div>
    </div>
  );
}

function CheckoutForm({ amount, clientSecret }) {
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || !clientSecret} className='mt-4 w-full sm:min-w-72 rounded-2xl bg-blue-500 text-white py-2'>
        Pay ₹{amount}
      </button>
      {paymentError && <div className="text-red-600 mt-2">{paymentError}</div>}
      {paymentSuccess && <div className="text-green-600 mt-2">Payment Successful!</div>}
    </form>
  );
}

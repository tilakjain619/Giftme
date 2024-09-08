import { useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';

const WithdrawForm = ({ onClose }) => {
  const { user } = useUser(); // Get user data
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.walletAmount <= 0) {
      setError('Insufficient balance for withdrawal');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/withdraw-request', {
        email: user.email,
        requestAmount: user.walletAmount,  // Auto-fill and send wallet balance
        paymentMethod,
        upiId,
        timestamp: new Date(),
      });

      if (response.status === 200) {
        alert('Withdrawal request submitted successfully');
        onClose(); // Close the form after successful submission
      } else {
        setError('Failed to submit withdrawal request');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white text-black p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Withdrawal Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Request Amount</label>
          <input
            type="number"
            value={user.walletAmount}
            className="w-full p-2 opacity-60 cursor-default border rounded outline-none"
            readOnly // User can't edit the amount, it's auto-filled
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded outline-none"
          >
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        {paymentMethod === 'UPI' && (
          <div className="mb-4">
            <label className="block mb-2">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-2 border rounded outline-none"
              placeholder="Enter UPI ID"
            />
          </div>
        )}

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithdrawForm;

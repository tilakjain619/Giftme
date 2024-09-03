'use client';
import SignupForm from '@/components/SignupForm';

const Signup = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;

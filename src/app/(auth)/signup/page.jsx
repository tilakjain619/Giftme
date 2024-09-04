'use client';
import FlickeringGrid from '@/components/magicui/flickering-grid';
import SignupForm from '@/components/SignupForm';

const Signup = () => {
  return (
    <div className="flex items-center px-3 justify-center min-h-[80vh]">
      <FlickeringGrid
                className="absolute -z-10 inset-0 size-full"
                squareSize={10}
                gridGap={6}
                color="#ddd"
                maxOpacity={0.5}
                flickerChance={0.1}
            />
      <div className="bg-white border-2 border-[#ffecd1] px-4 py-8 rounded shadow-lg shadow-slate-200 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;

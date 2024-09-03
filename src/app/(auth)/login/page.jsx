'use client'
import { useContext, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import FlickeringGrid from "@/components/magicui/flickering-grid";
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setIsLoggedIn } = useContext(AuthContext);  // Use context
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password,
            });

            if (response.status === 200) {
                setIsLoggedIn(true);
                // Redirect to the protected page or dashboard after successful login
                router.push('/dashboard');
            }
        } catch (error) {
            setError('Invalid email or password');
        }
    };
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
            <div className="bg-white border-2 border-[#ffecd1] p-8 rounded-md shadow-lg shadow-slate-200 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 outline-none border border-gray-300 rounded mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 outline-none border border-gray-300 rounded mt-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#ed5a6b] hover:bg-[#f68e7e] text-white p-2 rounded transition duration-100"
                    >
                        Login
                    </button>
                </form>
                <p className='mt-4 text-zinc-700'>Don't have an account? <Link className='hover:underline' href='/signup'>Sign up</Link></p>
            </div>
        </div>
    )
}

export default Login

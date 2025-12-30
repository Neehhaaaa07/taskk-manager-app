import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaTasks, FaArrowRight } from 'react-icons/fa';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'register';
        try {
            const res = await api.post(`/auth/${endpoint}`, form);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                toast.success("Authentication successful");
                navigate('/dashboard');
            } else {
                toast.success("Account created! Please sign in.");
                setIsLogin(true);
            }
        } catch (err) { 
            toast.error(err.response?.data?.msg || "Authentication failed"); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FBFA] p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                
                {/* Header Section */}
                <div className="px-8 pt-8 pb-6">
                    <div className="flex items-center gap-2 mb-6">
                        {/* Generic Task Icon instead of Logo */}
                        <FaTasks className="text-[#00684A] text-xl" />
                        <span className="font-bold text-[#00684A] text-xl tracking-tight">Task Manager</span>
                    </div>
                    
                    <h1 className="font-serif-app text-3xl font-bold text-[#1C2D38] mb-2">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isLogin ? 'Welcome back to your workspace.' : 'Start organizing your tasks today.'}
                    </p>
                </div>

                {/* Form Section */}
                <div className="px-8 pb-8">
                    <form onSubmit={handleAuth} className="space-y-5">
                        
                        <div>
                            <label className="block text-xs font-bold text-[#1C2D38] mb-1.5 uppercase">Username</label>
                            <input 
                                className="w-full border border-gray-400 rounded p-2.5 text-sm text-[#1C2D38] focus:border-[#00684A] focus:ring-1 focus:ring-[#00684A] outline-none transition-all"
                                placeholder="e.g. user_admin" 
                                value={form.username}
                                onChange={e => setForm({...form, username: e.target.value})} 
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-[#1C2D38] mb-1.5 uppercase">Password</label>
                            <input 
                                className="w-full border border-gray-400 rounded p-2.5 text-sm text-[#1C2D38] focus:border-[#00684A] focus:ring-1 focus:ring-[#00684A] outline-none transition-all"
                                type="password" 
                                placeholder="••••••••" 
                                value={form.password}
                                onChange={e => setForm({...form, password: e.target.value})} 
                                required
                            />
                        </div>

                        <button className="w-full bg-[#00684A] hover:bg-[#00503a] text-white py-2.5 rounded text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                            {isLogin ? 'Sign In' : 'Create Account'} <FaArrowRight size={12} />
                        </button>
                    </form>

                    {/* Footer / Switcher */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => setIsLogin(!isLogin)} 
                                className="text-[#00684A] font-bold hover:underline ml-1"
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
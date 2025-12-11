import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const [tenant, setTenant] = useState(null); // 'melmo' or 'tearaja'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTenantSelect = (selectedTenant) => {
        setTenant(selectedTenant);
        localStorage.setItem('tenantId', selectedTenant);
        setError('');
    };

    const handleBack = () => {
        setTenant(null);
        setError('');
        setUsername('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    if (!tenant) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-4xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Select Workspace</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Melmo's Kitchen Card */}
                        <div
                            onClick={() => handleTenantSelect('melmo')}
                            className="bg-white p-8 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 group"
                        >
                            <div className="h-40 bg-blue-50 rounded-lg mb-6 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <span className="text-4xl text-blue-500 font-bold">MK</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Melmo's Kitchen</h3>
                            <p className="text-gray-500">Manage kitchen inventory, recipes, and stock movements.</p>
                        </div>

                        {/* Tea Raja Card */}
                        <div
                            onClick={() => handleTenantSelect('tearaja')}
                            className="bg-white p-8 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-xl hover:green-200 transition-all duration-300 transform hover:-translate-y-1 group"
                        >
                            <div className="h-40 bg-green-50 rounded-lg mb-6 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <span className="text-4xl text-green-600 font-bold">TR</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Tea Raja</h3>
                            <p className="text-gray-500">Manage tea stall inventory, daily supplies, and sales.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-100 relative">
                <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    &larr; Back
                </button>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-6 font-medium">
                    {tenant === 'melmo' ? "Melmo's Kitchen" : "Tea Raja"}
                </p>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded mb-4 text-center text-sm">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${tenant === 'melmo' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

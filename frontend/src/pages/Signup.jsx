import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, Loader2, ArrowRight, UserCircle2, Stethoscope } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [specialization, setSpecialization] = useState('General Physician');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', { 
                name,
                email, 
                password, 
                role,
                specialization: role === 'doctor' ? specialization : undefined
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex justify-center items-center py-12">
            <div className="w-full max-w-md animate-fade-in glass-card rounded-2xl p-8 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 rounded-bl-[100px] pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                    <p className="text-slate-500">Join Doctro and manage your health journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50/80 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium animate-slide-up">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-primary-950/80 border-l-4 border-primary-500 text-primary-400 rounded-lg text-sm font-medium animate-slide-up">
                        Account created successfully! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-9000">
                                <UserCircle2 className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all outline-none"
                                placeholder={`Enter ${role === 'doctor' ? "doctor" : "patient"} name`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-9000">
                                <UserCircle2 className="h-5 w-5" />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all outline-none appearance-none"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    {role === 'doctor' && (
                        <div className="animate-slide-up">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Specialization</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-9000">
                                    <Stethoscope className="h-5 w-5" />
                                </div>
                                <select
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all outline-none appearance-none"
                                >
                                    <option value="General Physician">General Physician</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Orthopedic">Orthopedic</option>
                                    <option value="Psychiatrist">Psychiatrist</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-9000">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-9000">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all outline-none"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full relative flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-white font-semibold bg-primary-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg overflow-hidden group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span className="relative z-10">Sign Up</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600 relative z-10">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-400 hover:underline transition-all">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;

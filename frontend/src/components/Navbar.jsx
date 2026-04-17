import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isLandingPage = location.pathname === '/';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3' : 'bg-white/50 backdrop-blur-sm py-4 border-b border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-500 p-2 rounded-xl group-hover:bg-primary-700 transition-colors">
                        <Stethoscope className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        Doctro
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    {user && !isLandingPage ? (
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-medium text-slate-600 hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full capitalize">
                                <User w={16} h={16} className="shrink-0" />
                                <span className="flex flex-col items-start leading-tight">
                                    <span className="font-bold">{user.name || user.role}</span>
                                    {user.role === 'doctor' && user.specialization && (
                                        <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wide">{user.specialization}</span>
                                    )}
                                </span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors">
                                Log in
                            </Link>
                            <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

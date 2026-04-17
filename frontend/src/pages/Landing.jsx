import { Link } from 'react-router-dom';
import { Calendar, User, Shield, Activity, ArrowRight, HeartPulse } from 'lucide-react';
import doctorHeroImage from '../assets/d2.jpg';

const Landing = () => {
  return (
    <div className="flex-1 flex flex-col pt-8 pb-12 w-full animate-fade-in relative">
      {/* Decorative Blob */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-12 items-center justify-between mb-16 relative z-10 xl:px-0 px-4">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/50 text-primary-700 font-medium text-sm">
            <HeartPulse className="w-4 h-4" />
            <span>Healthcare Made Simple</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Your Health, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">
              Our Priority
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            Doctro is your one-stop solution for managing medical appointments, connecting with experienced doctors, and taking control of your health journey with ease and security.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-1 shadow-lg hover:shadow-primary-500/30"
            >
              Create Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-semibold transition-all hover:border-slate-300 shadow-sm"
            >
              Sign In <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="aspect-square max-w-md mx-auto relative hidden md:block group">
            <img
              src={doctorHeroImage}
              alt="Healthcare Professional"
              className="w-full h-full object-cover rounded-[3rem] shadow-2xl transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 relative z-10 w-full mb-8 px-4 xl:px-0">
        <div className="bg-white/60 backdrop-blur-sm border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-900 text-primary-500 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Easy Scheduling</h3>
          <p className="text-slate-600">Book and manage your doctor appointments instantly with our seamless scheduling system.</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-950 text-primary-500 rounded-xl flex items-center justify-center mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Health Tracking</h3>
          <p className="text-slate-600">Keep track of your medical history and access your health records whenever you need them.</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-900 text-primary-500 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Secure & Private</h3>
          <p className="text-slate-600">Your health data is encrypted and secure. We prioritize your privacy above all else.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

import { useState } from 'react';
import { Stethoscope, Calendar, Menu, X, Clock, LogIn, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  bookedCount: number;
  onOpenAuth: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onOpenBooking, bookedCount, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile, signOutUser } = useAuth();

  const isAdmin = userProfile?.email === 'shahnilakamboh23@gmail.com' || user?.email === 'shahnilakamboh23@gmail.com';

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Our Doctors' },
    { id: 'my-appointments', label: 'My Appointments' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Portal' }] : [])
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
    
    // Smooth scroll to top when changing tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayName = userProfile?.displayName || user?.displayName || 'Patient';

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => handleTabClick('home')}>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-medical-500 rounded-xl text-white shadow-md shadow-medical-500/20">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-lg font-extrabold tracking-tight text-slate-800">
                  We Care <span className="text-medical-500">Hospitals</span>
                </span>
                <p className="text-[9px] font-mono tracking-wider text-slate-400 uppercase font-semibold leading-none mt-0.5">
                  Your Health, Our Mission
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-medical-50 text-medical-700 font-semibold'
                      : 'text-slate-600 hover:text-medical-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.id === 'my-appointments' && bookedCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-medical-500 text-[11px] font-bold text-white animate-pulse">
                        {bookedCount}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Action Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-3.5">
            {user ? (
              <div className="flex items-center gap-3.5 pl-3.5 border-l border-slate-150">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
                  <UserCheck className="h-4 w-4 text-medical-500" />
                  <span className="text-xs font-bold font-sans max-w-[120px] truncate">{displayName}</span>
                </div>
                <button
                  onClick={signOutUser}
                  title="Sign Out"
                  className="p-2 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-150 hover:border-red-100 rounded-xl text-slate-500 transition-all cursor-pointer shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="h-4 w-4 text-medical-500" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-5 py-2.5 bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-medical-500/10 hover:shadow-medical-600/20 active:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-lg transition-all duration-300">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer flex justify-between items-center ${
                    isActive
                      ? 'bg-medical-50 text-medical-700 font-bold'
                      : 'text-slate-600 hover:text-medical-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'my-appointments' && bookedCount > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-500 text-xs font-bold text-white">
                      {bookedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Auth actions */}
          <div className="pt-4 pb-2 border-t border-slate-100 space-y-3">
            {user ? (
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                  <UserCheck className="h-4.5 w-4.5 text-medical-500" />
                  <span>{displayName}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOutUser();
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm cursor-pointer"
              >
                <LogIn className="h-4.5 w-4.5 text-medical-500" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3 bg-medical-600 text-white rounded-xl font-semibold shadow-md cursor-pointer"
            >
              <Calendar className="h-5 w-5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
